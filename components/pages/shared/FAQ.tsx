import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "How does the AI image generation work?",
      answer: "Our AI uses state-of-the-art diffusion models trained on millions of images to generate high-quality visuals from text descriptions. Simply describe what you want to create, and our AI will generate multiple options for you to choose from."
    },
    {
      question: "Can I use the generated images commercially?",
      answer: "Yes! All images generated with PixFusion AI Studio can be used for commercial purposes. You retain full rights to any content you create with our platform."
    },
    {
      question: "What file formats are supported?",
      answer: "We support all major image formats including JPG, PNG, GIF, and SVG. You can also export in various resolutions and quality settings to suit your needs."
    },
    {
      question: "How often do you add new features?",
      answer: "We release new features and improvements on a weekly basis. Our roadmap is publicly available, and we regularly survey our users to prioritize the most requested features."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! Our mobile app is available for both iOS and Android devices. You can create, edit, and share your designs on the go with the same powerful tools available on the web."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer 24/7 email support for all users, with live chat available for Pro and Business plan subscribers. We also have an extensive knowledge base and video tutorials to help you get started."
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-[#0a0a1f] to-[#0f0520]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about the product and billing
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl px-8 hover:border-purple-500/50 transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-lg font-bold text-white hover:text-purple-300 py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed pb-6 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
