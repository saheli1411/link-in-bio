import React, { Suspense } from "react";
import ProfileView from "./ProfileView";

interface PageProps {
  params: Promise<{ handle: string }>;
}

async function ProfileContainer({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return <ProfileView handle={handle} />;
}

export default function PublicProfilePage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-sans text-slate-400">
          Loading profile...
        </div>
      }
    >
      <ProfileContainer params={params} />
    </Suspense>
  );
}