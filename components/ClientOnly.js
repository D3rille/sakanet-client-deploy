/*
To make sure we only request data from the browser, we have to ensure 
that the components using hooks are only rendered on the client. We can 
accomplish this by creating a component that only renders its children in 
the browser and not on the server.
 */

//Add file as a component per page
/*Ex. A page in pages directory:
    <ClientOnly>
        <Countries />
    </ClientOnly>
 */
import { useEffect, useState } from "react";

export default function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}