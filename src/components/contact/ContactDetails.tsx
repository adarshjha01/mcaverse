// src/components/contact/ContactDetails.tsx
import { IconMail, IconMapPin } from "@/components/ui/Icons";

export const ContactDetails = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-slate-600 mb-8">
                Have a question or want to collaborate? Send us a message or visit us.
            </p>
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <IconMapPin className="w-6 h-6 text-indigo-600 mt-1" />
                    <div>
                        <h3 className="font-semibold">Our Address</h3>
                        <p className="text-slate-500">Singasandra, Bengaluru, Karnataka 560068, India</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <IconMail className="w-6 h-6 text-indigo-600 mt-1" />
                    <div>
                        <h3 className="font-semibold">Email Us</h3>
                        <a href="mailto:yt.adarshjha@gmail.com" className="text-indigo-600 hover:underline">
                            yt.adarshjha@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};