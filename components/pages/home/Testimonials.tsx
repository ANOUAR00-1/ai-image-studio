import { TestimonialCard } from "@/components/ui/cards"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      content: "PixFusion AI has completely transformed my workflow. What used to take me hours now takes minutes. The AI is incredibly accurate, and I love the quality of the outputs.",
      rating: 5,
      initials: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      content: "Our social media engagement has increased by 150% since we started using PixFusion. The quality of our visuals is consistently high, and the team loves how easy it is to use.",
      rating: 5,
      initials: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "Freelance Designer",
      content: "As a solo creator, PixFusion has been a game-changer. I can now produce professional-quality content that rivals big agencies, all on my own.",
      rating: 5,
      initials: "ER"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-[#0f0a1f] via-[#0a0118] to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Loved by Creators Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied users who have transformed their creative process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              rating={testimonial.rating}
              initials={testimonial.initials}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
