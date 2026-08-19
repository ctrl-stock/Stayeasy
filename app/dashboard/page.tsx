import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id as string },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <ProfileForm
        name={user!.name}
        email={user!.email}
        phone={user!.phone || ""}
      />
    </div>
  );
}