import Aurora from "@/components/aurora";
import Navbar from "@/components/Navbar/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <>
            <Aurora
              colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
              blend={1.0}
              amplitude={1.0}
              speed={0.3}
            />
          

            <div className="absolute top-0 w-full">

              <Navbar/>

              <div className="min-h-screen">
                {children}
              </div>

              {/* Footer */}
            </div>
        </>
    )
}