import { redirect } from "next/navigation";

import { GlobalMode } from "@/types/enums/GlobalMode";
import { getPath } from "@/utils/slug/paths";

export default function RootPage() {
  redirect(getPath(GlobalMode.Harmony));
}
