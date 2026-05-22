import { redirect } from "next/navigation";

import { scalePath } from "@/utils/slug/paths";
import { DEFAULT_SCALE_SLUG } from "@/utils/slug/scales";

export default function ScalesDemoPage() {
  redirect(scalePath(DEFAULT_SCALE_SLUG));
}
