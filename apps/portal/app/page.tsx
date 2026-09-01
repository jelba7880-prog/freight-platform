import { auth, signIn, signOut } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit">Sign in with Google</button>
        </form>
      </main>
    );
  }

  return (
    <main>
      <p>Signed in as {session.user.email}</p>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
