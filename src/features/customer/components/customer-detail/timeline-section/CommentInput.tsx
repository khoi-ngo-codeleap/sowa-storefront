import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAddComment from "@/features/customer/hooks/useAddComment";
import { toast } from "@/hooks/use-toast";
import { useCustomerId } from "@/providers/CustomerIdContext";
import { Smile, AtSign, Hash, Link, Loader } from "lucide-react";
import { useState } from "react";

const CommentInput = () => {
  const customerId = useCustomerId();
  const { mutate, isPending } = useAddComment();
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "It seems like you haven't entered a comment",
      });
      return;
    }

    mutate(
      {
        id: customerId,
        message: comment,
      },
      {
        onSuccess: () => setComment(""),
      }
    );
  };

  return (
    <div className="relative">
      <div className="rounded-xl overflow-hidden border bg-background">
        <div className="flex items-start gap-3 px-4 py-3">
          {/* Avatar */}
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-pink-500 text-white font-bold">
              KĐ
            </AvatarFallback>
          </Avatar>

          {/* Input box */}
          <div className="flex-1">
            <Input
              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Leave a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-muted-foreground text-sm px-4 py-3 bg-secondary">
          <div className="flex-1 flex items-center gap-3">
            {[Smile, AtSign, Hash, Link].map((Icon) => (
              <Tooltip key={Icon.displayName}>
                <TooltipTrigger>
                  <Icon key={Icon.name} className="h-4 w-4 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming soon</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div>
            <Button
              size="sm"
              disabled={!comment.trim() || isPending}
              onClick={handleSubmit}
            >
              {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Post
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute right-0 flex justify-end">
        <span className="text-muted-foreground float-right text-right">
          Only you and other staff can see comments
        </span>
      </div>
    </div>
  );
};

export default CommentInput;
