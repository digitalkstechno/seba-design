import Image from "next/image";
import Login from "./auth/page";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">
       <Login/>
    </div>
  );
}
