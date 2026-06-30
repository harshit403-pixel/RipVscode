"use client";

import { useParams } from "next/navigation";
import RoomPage from "@/features/room/ui/jsx/RoomPage";

export default function Page() {
  const { roomCode } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res =
          await getRoom(roomCode);
 
        setRoom(res.data.data);
      } catch (err) {
        console.log(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (roomCode) {
      fetchRoom();
    }
  }, [roomCode, router]);

  return <RoomPage roomCode={roomCode} />;
}
