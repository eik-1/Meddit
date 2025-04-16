import Image from "next/image";
import Link from "next/link";

import meddit from "../../public/meddit.png";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center justify-end gap-3">
      <Image
        className="size-12 dark:invert"
        src={meddit}
        alt="main-logo"
        width={100}
        height={100}
      />
      <span className="font-bold text-3xl">Meddit</span>
    </Link>
  );
}
