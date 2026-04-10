"use server";

import { promises as fs } from "fs";
import path from "path";

const WAITLIST_PATH = path.join(process.cwd(), "waitlist.json");

interface WaitlistEntry {
  email: string;
  subscribedAt: string;
}

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const data = await fs.readFile(WAITLIST_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeWaitlist(entries: WaitlistEntry[]) {
  await fs.writeFile(WAITLIST_PATH, JSON.stringify(entries, null, 2), "utf-8");
}

export async function subscribe(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const entries = await readWaitlist();

    if (entries.some((e) => e.email === trimmed)) {
      return { success: true };
    }

    entries.push({ email: trimmed, subscribedAt: new Date().toISOString() });
    await writeWaitlist(entries);

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
