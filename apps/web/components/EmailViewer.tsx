"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDisplayedEmail } from "@/hooks/useDisplayedEmail";
import { EmailThread } from "@/components/email-list/EmailPanel";
import { useThread } from "@/hooks/useThread";
import { LoadingContent } from "@/components/LoadingContent";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function EmailViewer() {
  const { threadId, showEmail, showReplyButton, autoOpenReplyForMessageId } =
    useDisplayedEmail();

  const hideEmail = useCallback(() => showEmail(null), [showEmail]);

  const { data } = useSession();

  return (
    <Sheet open={!!threadId} onOpenChange={hideEmail}>
      <SheetContent
        side="right"
        size="5xl"
        className="overflow-y-auto bg-slate-100 p-0"
        overlay="transparent"
      >
        {threadId && (
          <EmailContent
            threadId={threadId}
            showReplyButton={showReplyButton}
            autoOpenReplyForMessageId={autoOpenReplyForMessageId ?? undefined}
            userEmail={data?.user.email || ""}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function EmailContent({
  threadId,
  showReplyButton,
  autoOpenReplyForMessageId,
  userEmail,
}: {
  threadId: string;
  showReplyButton: boolean;
  autoOpenReplyForMessageId?: string;
  userEmail: string;
}) {
  const { data, isLoading, error, mutate } = useThread({ id: threadId });

  return (
    <ErrorBoundary extra={{ component: "EmailContent", threadId }}>
      <LoadingContent loading={isLoading} error={error}>
        {data && (
          <EmailThread
            messages={data.thread.messages}
            refetch={mutate}
            showReplyButton={showReplyButton}
            autoOpenReplyForMessageId={autoOpenReplyForMessageId}
            userEmail={userEmail}
          />
        )}
      </LoadingContent>
    </ErrorBoundary>
  );
}
