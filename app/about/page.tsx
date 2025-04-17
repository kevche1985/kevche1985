"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function AboutPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const content = {
    en: {
      title: "About Us",
      subtitle: "Learn more about PrintOnDemand",
      tabs: {
        mission: "Mission & Vision",
        history: "Our History",
        team: "Our Team",
        community: "Community",
      },
      mission: {
        title: "Our Mission",
        content:
          "At PrintOnDemand, our mission is to provide high-quality, customizable printing solutions that help businesses and individuals bring their creative visions to life. We are committed to delivering exceptional service, innovative products, and sustainable printing practices that exceed our customers' expectations.",
        visionTitle: "Our Vision",
        visionContent:
          "We envision a world where custom printing is accessible to everyone, empowering creativity and self-expression. We strive to be the leading provider of print-on-demand services, known for our quality, innovation, and commitment to customer satisfaction.",
      },
      history: {
        title: "Our Journey",
        content:
          "PrintOnDemand was founded in 2010 by a group of printing industry veterans who saw the potential of digital printing technology to revolutionize the way people create and order printed products. What started as a small operation with just two digital printers has grown into a comprehensive printing service with state-of-the-art equipment and a dedicated team of professionals.",
        milestones: [
          {
            year: "2010",
            title: "Company Founded",
            description: "PrintOnDemand was established with a focus on digital printing services.",
          },
          {
            year: "2013",
            title: "Expansion of Services",
            description: "Added large format printing and expanded product offerings.",
          },
          {
            year: "2016",
            title: "New Headquarters",
            description: "Moved to a larger facility to accommodate growing operations.",
          },
          {
            year: "2019",
            title: "E-commerce Platform Launch",
            description: "Launched our online ordering system for seamless customer experience.",
          },
          {
            year: "2022",
            title: "Sustainability Initiative",
            description: "Implemented eco-friendly practices and materials across all operations.",
          },
          {
            year: "2024",
            title: "AI Integration",
            description: "Introduced AI-powered design tools to enhance customer creativity.",
          },
        ],
      },
      team: {
        title: "Our Leadership Team",
        content:
          "Our success is driven by our dedicated team of professionals who bring expertise, passion, and creativity to everything we do.",
        members: [
          {
            name: "Maria Rodriguez",
            position: "Chief Executive Officer",
            bio: "With over 20 years of experience in the printing industry, Maria leads our company with vision and dedication.",
          },
          {
            name: "David Chen",
            position: "Chief Operations Officer",
            bio: "David oversees all production operations, ensuring efficiency and quality in every project we deliver.",
          },
          {
            name: "Sarah Johnson",
            position: "Creative Director",
            bio: "Sarah brings artistic vision and technical expertise to guide our design services and creative solutions.",
          },
          {
            name: "Michael Patel",
            position: "Chief Technology Officer",
            bio: "Michael leads our technology initiatives, including our e-commerce platform and AI design tools.",
          },
        ],
        structure:
          "Our organization is structured to provide specialized expertise in every aspect of the printing process, from initial design consultation to production and delivery. We operate with dedicated departments for customer service, design, production, quality control, and logistics, all working together to ensure a seamless experience for our clients.",
      },
      community: {
        title: "Community Involvement",
        content:
          "At PrintOnDemand, we believe in giving back to the communities we serve. We are committed to making a positive impact through various initiatives and partnerships.",
        initiatives: [
          {
            title: "Environmental Sustainability",
            description:
              "We use eco-friendly materials and processes whenever possible, and we're constantly working to reduce our environmental footprint.",
          },
          {
            title: "Education Support",
            description:
              "We partner with local schools and universities to provide printing services for educational materials and support design education programs.",
          },
          {
            title: "Small Business Empowerment",
            description:
              "We offer special programs and resources to help small businesses and entrepreneurs establish their brand identity through quality printed materials.",
          },
          {
            title: "Charitable Partnerships",
            description:
              "We donate a portion of our profits to local charities and provide pro bono printing services for nonprofit organizations.",
          },
        ],
      },
    },
    es: {
      title: "Nosotros",
      subtitle: "Conoce más sobre PrintOnDemand",
      tabs: {
        mission: "Misión y Visión",
        history: "Nuestra Historia",
        team: "Nuestro Equipo",
        community: "Comunidad",
      },
      mission: {
        title: "Nuestra Misión",
        content:
          "En PrintOnDemand, nuestra misión es proporcionar soluciones de impresión personalizables de alta calidad que ayuden a empresas e individuos a dar vida a sus visiones creativas. Estamos comprometidos a ofrecer un servicio excepcional, productos innovadores y prácticas de impresión sostenibles que superen las expectativas de nuestros clientes.",
        visionTitle: "Nuestra Visión",
        visionContent:
          "Visualizamos un mundo donde la impresión personalizada sea accesible para todos, potenciando la creatividad y la autoexpresión. Nos esforzamos por ser el proveedor líder de servicios de impresión bajo demanda, conocidos por nuestra calidad, innovación y compromiso con la satisfacción del cliente.",
      },
      history: {
        title: "Nuestro Recorrido",
        content:
          "PrintOnDemand fue fundada en 2010 por un grupo de veteranos de la industria de la impresión que vieron el potencial de la tecnología de impresión digital para revolucionar la forma en que las personas crean y ordenan productos impresos. Lo que comenzó como una pequeña operación con solo dos impresoras digitales se ha convertido en un servicio de impresión integral con equipos de última generación y un equipo dedicado de profesionales.",
        milestones: [
          {
            year: "2010",
            title: "Fundación de la Empresa",
            description: "PrintOnDemand se estableció con un enfoque en servicios de impresión digital.",
          },
          {
            year: "2013",
            title: "Expansión de Servicios",
            description: "Añadimos impresión de gran formato y expandimos nuestra oferta de productos.",
          },
          {
            year: "2016",
            title: "Nueva Sede",
            description: "Nos trasladamos a instalaciones más grandes para acomodar operaciones en crecimiento.",
          },
          {
            year: "2019",
            title: "Lanzamiento de Plataforma E-commerce",
            description: "Lanzamos nuestro sistema de pedidos en línea para una experiencia de cliente sin problemas.",
          },
          {
            year: "2022",
            title: "Iniciativa de Sostenibilidad",
            description: "Implementamos prácticas y materiales ecológicos en todas nuestras operaciones.",
          },
          {
            year: "2024",
            title: "Integración de IA",
            description:
              "Introdujimos herramientas de diseño potenciadas por IA para mejorar la creatividad del cliente.",
          },
        ],
      },
      team: {
        title: "Nuestro Equipo Directivo",
        content:
          "Nuestro éxito es impulsado por nuestro dedicado equipo de profesionales que aportan experiencia, pasión y creatividad a todo lo que hacemos.",
        members: [
          {
            name: "María Rodríguez",
            position: "Directora Ejecutiva",
            bio: "Con más de 20 años de experiencia en la industria de la impresión, María lidera nuestra empresa con visión y dedicación.",
          },
          {
            name: "David Chen",
            position: "Director de Operaciones",
            bio: "David supervisa todas las operaciones de producción, asegurando eficiencia y calidad en cada proyecto que entregamos.",
          },
          {
            name: "Sarah Johnson",
            position: "Directora Creativa",
            bio: "Sarah aporta visión artística y experiencia técnica para guiar nuestros servicios de diseño y soluciones creativas.",
          },
          {
            name: "Michael Patel",
            position: "Director de Tecnología",
            bio: "Michael lidera nuestras iniciativas tecnológicas, incluyendo nuestra plataforma de comercio electrónico y herramientas de diseño con IA.",
          },
        ],
        structure:
          "Nuestra organización está estructurada para proporcionar experiencia especializada en todos los aspectos del proceso de impresión, desde la consulta inicial de diseño hasta la producción y entrega. Operamos con departamentos dedicados para servicio al cliente, diseño, producción, control de calidad y logística, todos trabajando juntos para garantizar una experiencia sin problemas para nuestros clientes.",
      },
      community: {
        title: "Participación Comunitaria",
        content:
          "En PrintOnDemand, creemos en retribuir a las comunidades a las que servimos. Estamos comprometidos a generar un impacto positivo a través de varias iniciativas y asociaciones.",
        initiatives: [
          {
            title: "Sostenibilidad Ambiental",
            description:
              "Utilizamos materiales y procesos ecológicos siempre que es posible, y trabajamos constantemente para reducir nuestra huella ambiental.",
          },
          {
            title: "Apoyo a la Educación",
            description:
              "Nos asociamos con escuelas y universidades locales para proporcionar servicios de impresión para materiales educativos y apoyar programas de educación en diseño.",
          },
          {
            title: "Empoderamiento de Pequeñas Empresas",
            description:
              "Ofrecemos programas especiales y recursos para ayudar a pequeñas empresas y emprendedores a establecer su identidad de marca a través de materiales impresos de calidad.",
          },
          {
            title: "Asociaciones Benéficas",
            description:
              "Donamos una parte de nuestras ganancias a organizaciones benéficas locales y proporcionamos servicios de impresión pro bono para organizaciones sin fines de lucro.",
          },
        ],
      },
    },
  }

  const t = language === "en" ? content.en : content.es

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-xl text-muted-foreground">{t.subtitle}</p>
      </div>

      <Tabs defaultValue="mission" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
          <TabsTrigger value="mission">{t.tabs.mission}</TabsTrigger>
          <TabsTrigger value="history">{t.tabs.history}</TabsTrigger>
          <TabsTrigger value="team">{t.tabs.team}</TabsTrigger>
          <TabsTrigger value="community">{t.tabs.community}</TabsTrigger>
        </TabsList>

        <TabsContent value="mission">
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-primary">{t.mission.title}</h2>
                  <p className="text-lg mb-6">{t.mission.content}</p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-primary">{t.mission.visionTitle}</h2>
                  <p className="text-lg mb-6">{t.mission.visionContent}</p>
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=500"
                      alt="Our Vision"
                      width={500}
                      height={300}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">{t.history.title}</h2>
              <p className="text-lg mb-8">{t.history.content}</p>

              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-muted"></div>
                <div className="space-y-8">
                  {t.history.milestones.map((milestone, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {milestone.year.substring(2)}
                      </div>
                      <h3 className="text-xl font-bold">
                        {milestone.year} - {milestone.title}
                      </h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">{t.team.title}</h2>
              <p className="text-lg mb-8">{t.team.content}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {t.team.members.map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="h-32 w-32 rounded-full bg-muted mx-auto mb-4 overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=128&width=128&text=${encodeURIComponent(member.name.split(" ")[0][0] + member.name.split(" ")[1][0])}`}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-primary font-medium">{member.position}</p>
                    <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-4">Organization Structure</h3>
              <p className="text-muted-foreground">{t.team.structure}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">{t.community.title}</h2>
              <p className="text-lg mb-8">{t.community.content}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {t.community.initiatives.map((initiative, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">{initiative.title}</h3>
                    <p className="text-muted-foreground">{initiative.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=800&text=Community+Impact"
                  alt="Community Impact"
                  width={800}
                  height={300}
                  className="object-cover w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
