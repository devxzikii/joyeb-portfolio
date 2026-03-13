const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function telegramRequest<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.ok) {
    const description =
      typeof payload?.description === 'string'
        ? payload.description
        : `Telegram API error: ${response.status}`;
    throw new Error(description);
  }

  return payload.result as T;
}

async function main() {
  if (!token) {
    fail('Missing TELEGRAM_BOT_TOKEN in environment variables.');
  }

  const baseUrl = `https://api.telegram.org/bot${token}`;
  const me = await telegramRequest<{ first_name?: string; username?: string }>(
    `${baseUrl}/getMe`,
  );

  console.log(`Bot connected: ${me.first_name || 'Unknown'} (@${me.username || 'unknown'})`);

  if (chatId) {
    try {
      const chat = await telegramRequest<{ id: number | string; type?: string; title?: string; username?: string; first_name?: string }>(
        `${baseUrl}/getChat?chat_id=${encodeURIComponent(chatId)}`,
      );

      console.log(`Configured TELEGRAM_CHAT_ID is valid: ${chat.id}`);
      console.log(
        `Chat details: ${chat.title || chat.username || chat.first_name || 'Unnamed'} (${chat.type || 'unknown'})`,
      );
    } catch (error) {
      console.error(
        `Configured TELEGRAM_CHAT_ID is invalid or the bot cannot access it: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  const updates = await telegramRequest<Array<{ message?: { chat?: { id?: number | string; type?: string; title?: string; username?: string; first_name?: string } } }>>(
    `${baseUrl}/getUpdates`,
  );

  const chats = new Map<string, string>();
  for (const update of updates) {
    const chat = update.message?.chat;
    if (!chat?.id) {
      continue;
    }

    chats.set(
      String(chat.id),
      `${chat.title || chat.username || chat.first_name || 'Unnamed'} (${chat.type || 'unknown'})`,
    );
  }

  if (chats.size === 0) {
    console.log('No Telegram chats found yet. Open the bot in Telegram and send /start, then run this command again.');
    return;
  }

  console.log('Available chat IDs from recent bot updates:');
  for (const [id, label] of chats.entries()) {
    console.log(`- ${id}: ${label}`);
  }

  if (!chatId) {
    console.log('Set TELEGRAM_CHAT_ID to one of the chat IDs above.');
  }
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : 'Telegram validation failed.');
});