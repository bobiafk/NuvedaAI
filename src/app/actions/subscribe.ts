"use server";

const LOOPS_API_KEY = process.env.LOOPS_API_KEY ?? "";

export async function subscribe(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!LOOPS_API_KEY) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  try {
    const res = await fetch("https://app.loops.so/api/v1/contacts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: trimmed, source: "waitlist" }),
    });

    const data = await res.json();

    if (data.success) return { success: true };
    if (res.status === 409) return { success: true };
    return { success: false, error: "Something went wrong. Please try again." };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
