import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Kredensial Supabase belum terpasang di file .env!");
}

// Export instance supabase agar bisa dipakai di service manapun
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
