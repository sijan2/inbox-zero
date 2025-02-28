"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { MessageText } from "@/components/Typography";
import { getGmailUrl } from "@/utils/url";
import { decodeSnippet } from "@/utils/gmail/decode";
import { ViewEmailButton } from "@/components/ViewEmailButton";
import { useThread } from "@/hooks/useThread";

export function EmailMessageCell({
  from,
  userEmail,
  subject,
  snippet,
  threadId,
  messageId,
}: {
  from: string;
  userEmail: string;
  subject: string;
  snippet: string;
  threadId: string;
  messageId: string;
}) {
  return (
    <div className="min-w-0 break-words">
      <MessageText className="flex items-center">
        {from}{" "}
        <Link
          className="ml-2 hover:text-gray-900"
          href={getGmailUrl(messageId, userEmail)}
          target="_blank"
        >
          <ExternalLinkIcon className="h-4 w-4" />
        </Link>
        <ViewEmailButton
          threadId={threadId}
          messageId={messageId}
          size="xs"
          className="ml-1.5"
        />
      </MessageText>
      <MessageText className="mt-1 font-bold">{subject}</MessageText>
      <MessageText className="mt-1">
        {decodeSnippet(snippet).trim()}
      </MessageText>
    </div>
  );
}

export function EmailMessageCellWithData({
  from,
  userEmail,
  threadId,
  messageId,
}: {
  from: string;
  userEmail: string;
  threadId: string;
  messageId: string;
}) {
  const { data, isLoading, error } = useThread({ id: threadId });

  return (
    <EmailMessageCell
      from={from}
      userEmail={userEmail}
      subject={
        error
          ? "Error loading email"
          : isLoading
            ? "Loading email..."
            : data?.thread.messages?.[0]?.headers.subject || ""
      }
      snippet={
        error ? "" : isLoading ? "" : data?.thread.messages?.[0]?.snippet || ""
      }
      threadId={threadId}
      messageId={messageId}
    />
  );
}
