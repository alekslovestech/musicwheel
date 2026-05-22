import { redirect } from "next/navigation";

import { progressionPath } from "@/utils/slug/paths";
import { DEFAULT_PROGRESSION_SLUG } from "@/utils/slug/progressions";

export default function ProgressionsPage() {
  redirect(progressionPath(DEFAULT_PROGRESSION_SLUG));
}
