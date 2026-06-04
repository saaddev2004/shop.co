/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa6";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay } from "react-icons/fa";

const Footer = () => {
  const sections = [
    {
      title: "Company",
      links: ["About", "Features of SHOP.CO", "Works", "Career"],
    },
    {
      title: "Help",
      links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
    },
    {
      title: "FAQ",
      links: ["Account", "Manage Deliveries", "Orders", "Payments"],
    },
    {
      title: "Resources",
      links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <footer className="bg-[#F0F0F0] dark:bg-neutral-900 pt-32 pb-12 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          
          {/* Brand Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h2 className="text-3xl font-extrabold mb-4 font-heading dark:text-white tracking-tight">SHOP.CO</h2>
            <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed mb-8">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: FaGithub, url: "https://github.com/saaddev2004", hoverClass: "hover:text-[#333] dark:hover:text-white" },
                { Icon: FaInstagram, url: "https://www.instagram.com/_m.saadd/?__pwa=1", hoverClass: "hover:text-[#E1306C]" },
                { Icon: FaLinkedinIn, url: "https://www.linkedin.com/in/m-saad-dev/", hoverClass: "hover:text-[#0A66C2]" }
              ].map(({ Icon, url, hoverClass }, i) => (
                <a 
                  key={i} 
                  href={url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center text-black/60 dark:text-white/60 transition-all hover:scale-110 shadow-sm hover:shadow-md hover:border-black/20 dark:hover:border-white/20 ${hoverClass}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          {sections.map((section) => (
            <motion.div variants={itemVariants} key={section.title}>
              <h5 className="text-base font-bold  tracking-widest mb-6 dark:text-white">
                {section.title}
              </h5>
              <ul className="flex flex-col gap-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-black/60 dark:text-white/60 text-sm hover:text-black dark:hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-8 mt-12 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="text-center md:text-left flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <p className="text-black/60 dark:text-white/60 text-sm font-medium">
              SHOP.CO &copy; {new Date().getFullYear()}. All Rights Reserved.
            </p>
            <div className="hidden md:block w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
            <p className="text-black/50 dark:text-white/50 text-sm font-medium flex items-center justify-center md:justify-start gap-1.5">
              Designed & Developed by
              <a href="#" className="text-black dark:text-white font-bold hover:underline transition-all">
                Muhammad Saad
              </a>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {[
              { Icon: FaCcVisa, colorClass: "hover:text-[#1434CB]" },
              { Icon: FaCcMastercard, colorClass: "hover:text-[#EB001B]" },
              { Icon: FaCcPaypal, colorClass: "hover:text-[#00457C]" },
              { Icon: FaCcApplePay, colorClass: "hover:text-black dark:hover:text-white" }
            ].map(({ Icon, colorClass }, idx) => (
              <div key={idx} className={`bg-white dark:bg-neutral-800 w-12 h-8 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm hover:scale-110 transition-all cursor-pointer text-black/40 dark:text-white/40 ${colorClass}`}>
                <Icon size={22} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
