import { Card, CardContent } from "@/components/ui/card"
import { 
  Lightbulb, 
  Users, 
  Target, 
  Rocket,
  Sparkles
} from "lucide-react"

export function AboutPage() {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We push the boundaries of what's possible with AI technology.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Everything we build is designed to empower creators and make their lives easier.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Precision & Quality",
      description: "We never compromise on quality - every output meets the highest standards.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Rocket,
      title: "Move Fast",
      description: "We iterate quickly and ship features that matter to our users.",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const team = [
    {
      name: "Alex Morgan",
      role: "Founder & CEO",
      bio: "Former AI researcher at Google with 10+ years of experience in computer vision.",
      initials: "AM"
    },
    {
      name: "Jamie Chen",
      role: "Head of Product",
      bio: "Ex-Adobe product lead with a passion for making complex tools simple.",
      initials: "JC"
    },
    {
      name: "Taylor Williams",
      role: "Chief Technology Officer",
      bio: "Built ML infrastructure at scale for Fortune 500 companies.",
      initials: "TW"
    },
    {
      name: "Jordan Lee",
      role: "Head of Design",
      bio: "Award-winning designer focused on creating delightful user experiences.",
      initials: "JL"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">About PixFusion AI</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Empowering Creators with
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                AI Innovation
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed mb-12">
              We&apos;re on a mission to democratize creative AI tools, making professional-grade content creation accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card 
                  key={index} 
                  className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Passionate experts dedicated to building the future of creative AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {member.initials}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-purple-400 font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-purple-600/30 border-2 border-purple-500/40 backdrop-blur-2xl shadow-2xl shadow-purple-500/30">
            <CardContent className="p-16 text-center">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Our Mission
              </h2>
              <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                To democratize access to professional-grade AI creative tools, enabling anyone to bring their imagination to life with cutting-edge technology that&apos;s both powerful and easy to use.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
