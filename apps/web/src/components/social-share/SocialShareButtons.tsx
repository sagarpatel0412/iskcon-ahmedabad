import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";
import { Copy, Share2 } from "lucide-react";

export default function SocialShareButtons({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description?: string;
}) {
  const message = `${title}\n\n${description || ""}`;

  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(url);
    alert("Link copied 🙏");
  };

  return (
    <div
      onClick={(e) => e.preventDefault()}
      className="flex items-center gap-2"
    >
      <WhatsappShareButton url={url} title={message}>
        <WhatsappIcon size={34} round />
      </WhatsappShareButton>

      <FacebookShareButton url={url} hashtag="#ISKCONAhmedabad">
        <FacebookIcon size={34} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={message}>
        <TwitterIcon size={34} round />
      </TwitterShareButton>

      <TelegramShareButton url={url} title={message}>
        <TelegramIcon size={34} round />
      </TelegramShareButton>

      <LinkedinShareButton url={url} title={title} summary={description}>
        <LinkedinIcon size={34} round />
      </LinkedinShareButton>

      <button
        onClick={copyLink}
        className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-slate-100 text-slate-700"
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}