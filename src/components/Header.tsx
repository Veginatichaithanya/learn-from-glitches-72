
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Code2, Menu, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AdminSignInModal from "./AdminSignInModal";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "About this project", href: "/about" },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      // Handle anchor links on the current page
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Handle navigation to different pages
      navigate(href);
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-poppins">Learn from Errors</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/student/login")}
            >
              <User className="h-4 w-4 mr-2" />
              Student Login
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAdminModalOpen(true)}
            >
              Admin Login
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-6 mt-8">
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
                      >
                        {item.name}
                      </button>
                    ))}
                  </nav>
                  <div className="border-t pt-4 space-y-4">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        navigate("/student/login");
                        setIsOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Student Login
                    </Button>
                    <Button
                      variant="default"
                      className="w-full justify-start"
                      onClick={() => {
                        setIsAdminModalOpen(true);
                        setIsOpen(false);
                      }}
                    >
                      Admin Login
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Admin Sign In Modal */}
      <AdminSignInModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </header>
  );
};

export default Header;
