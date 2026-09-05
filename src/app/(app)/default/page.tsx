import { redirect } from "next/navigation";

import { GlobalMode } from "@/types/enums/GlobalMode";
import { getPath } from "@/utils/slug/paths";

export default function DefaultPage() {
  redirect(getPath(GlobalMode.Harmony));
}
