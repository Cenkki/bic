import HomePageClient from "@/components/HomePageClient";
import { getStatistics } from "@/lib/statistics";

export default async function Home() {
  const statistics = await getStatistics();
  
  return <HomePageClient initialStatistics={statistics} />;
}