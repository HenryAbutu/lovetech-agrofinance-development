import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listCourses from "./tools/list-courses";
import myEnrolments from "./tools/my-enrolments";
import myWaitlist from "./tools/my-waitlist";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "lovetech-agrofinance-development",
  title: "Lovetech Agrofinance & Development",
  version: "0.1.0",
  instructions:
    "Tools for LoveTech Academy. Browse published courses, and see the signed-in learner's enrolments and waitlist entries.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listCourses, myEnrolments, myWaitlist],
});
