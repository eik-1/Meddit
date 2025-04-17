"use client";

import { useFormStatus } from "react-dom";
import { addComment, AddCommentState } from "@/lib/actions";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

type CommentFormProps = {
  postId: number;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      <Send size={16} className="mr-1" />{" "}
      {pending ? "Posting..." : "Post Comment"}
    </Button>
  );
}

export default function CommentForm({ postId }: CommentFormProps) {
  const initialState: AddCommentState = null;
  const [state, formAction] = useActionState(addComment, initialState);

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      textAreaRef.current?.focus();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col space-y-3">
      <input type="hidden" name="postId" value={postId} />
      <Textarea
        ref={textAreaRef}
        name="text"
        placeholder="Add your comment..."
        required
        minLength={1}
        maxLength={10000}
        className={`min-h-[80px] ${
          state?.errors?.text ? "border-red-500" : ""
        }`}
        aria-describedby="comment-error"
      />
      <div className="flex items-center justify-between">
        <div id="comment-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.text && (
            <p className="text-sm text-red-500">{state.errors.text[0]}</p>
          )}
          {state?.errors?._form && (
            <p className="text-sm text-red-500">{state.errors._form[0]}</p>
          )}
        </div>
        <SubmitButton />
      </div>
    </form>
  );
}
