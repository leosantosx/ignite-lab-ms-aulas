import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";

export default function Dashboard() {
  const { user } = useUser();
  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();