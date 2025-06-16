import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Smile, AtSign, Hash, Link } from "lucide-react";
import { useState } from "react";

const CommentInput = () => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      console.log("Submitted:", comment);
      setComment("");
    }
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
            <Button size="sm" disabled={!comment.trim()} onClick={handleSubmit}>
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
