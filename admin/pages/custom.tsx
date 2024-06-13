import Link from "next/link";
import React from "react";
import { Button } from "./components/button";

export default function CustomPage() {
  return (
    <>
      <h1>This is a custom Admin UI Page</h1>
      <p>
        It can be accessed via the route{" "}
        <Link href="/custom-page">/custom-page</Link>
      </p>
      <Button />
    </>
  );
}
