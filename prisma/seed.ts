import { PrismaClient, type PillarTag } from '@prisma/client'
import { hashPassword } from '../src/lib/password'

const prisma = new PrismaClient()

const SUPER_ADMIN_EMAIL = 'kingdomelect4africa@gmail.com'
const SUPER_ADMIN_PASSWORD = 'KingdomELECT(100%)'

async function main() {
  // -------------------------------------------------------------------------
  // Site settings
  // -------------------------------------------------------------------------
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: 'Kingdom E.L.E.C.T. for Africa',
      tagline: 'Building Influence. Transforming Africa.',
      contactEmail: 'info@kingdomelect.africa',
      footerText:
        'Kingdom E.L.E.C.T. for Africa mobilizes Educators, Leaders, Entrepreneurs, Creatives, and Technocrats to transform Africa by reforming people, strengthening institutions, and developing territories.',
      defaultSeoTitle: 'Kingdom E.L.E.C.T. for Africa',
      defaultSeoDescription:
        "Africa's premier Kingdom governance and strategic intelligence platform.",
      socialLinks: { instagram: '', x: '', youtube: '', linkedin: '' },
    },
  })

  // -------------------------------------------------------------------------
  // Chapter + People
  // -------------------------------------------------------------------------
  const chapter = await prisma.chapter.upsert({
    where: { slug: 'nigeria' },
    update: {},
    create: {
      country: 'NG',
      name: 'Nigeria Chapter',
      slug: 'nigeria',
      description:
        'The founding chapter of Kingdom E.L.E.C.T. for Africa, convening reformers across education, government, enterprise, media, and technology.',
      contactEmail: 'nigeria@kingdomelect.africa',
      launchDate: new Date('2025-01-01'),
      status: 'ACTIVE',
    },
  })

  const superAdminPerson = await prisma.person.upsert({
    where: { slug: 'john-enietan' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Enietan',
      slug: 'john-enietan',
      title: 'Convener',
      country: 'NG',
      homeChapterId: chapter.id,
      bio: 'Convener of Kingdom E.L.E.C.T. for Africa, building a continental ecosystem of Kingdom-minded educators, leaders, entrepreneurs, creatives, and technocrats.',
      pillarTags: ['LEADER'],
      email: SUPER_ADMIN_EMAIL,
      consentToPublish: true,
      status: 'ACTIVE',
    },
  })

  const passwordHash = await hashPassword(SUPER_ADMIN_PASSWORD)
  await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: {},
    create: {
      email: SUPER_ADMIN_EMAIL,
      passwordHash,
      name: 'John Enietan',
      role: 'SUPER_ADMIN',
      personId: superAdminPerson.id,
    },
  })

  const speakerPeople = await Promise.all(
    [
      {
        slug: 'adaeze-nwosu',
        firstName: 'Adaeze',
        lastName: 'Nwosu',
        title: 'Vice-Chancellor & Kingdom Education Strategist',
        pillarTags: ['EDUCATOR'] as PillarTag[],
        bio: 'Adaeze leads curriculum reform initiatives across three national university systems, embedding Kingdom principles into public education policy.',
      },
      {
        slug: 'kwame-boateng',
        firstName: 'Kwame',
        lastName: 'Boateng',
        title: 'Founder, Continental Ventures Group',
        pillarTags: ['ENTREPRENEUR'] as PillarTag[],
        bio: 'Kwame has built and exited three pan-African enterprises, and now mentors Kingdom entrepreneurs turning profit into platforms for transformation.',
      },
      {
        slug: 'naledi-mokoena',
        firstName: 'Naledi',
        lastName: 'Mokoena',
        title: 'Creative Director & Cultural Strategist',
        pillarTags: ['CREATIVE'] as PillarTag[],
        bio: "Naledi's storytelling and design work has reframed how three national broadcasters present Africa's development narrative.",
      },
      {
        slug: 'daniel-osei',
        firstName: 'Daniel',
        lastName: 'Osei',
        title: 'Chief Technology Advisor, Public Digital Infrastructure',
        pillarTags: ['TECHNOCRAT'] as PillarTag[],
        bio: 'Daniel advises three national governments on digital public infrastructure, applying ethical, Kingdom-centred innovation to civic technology.',
      },
    ].map((p) =>
      prisma.person.upsert({
        where: { slug: p.slug },
        update: {},
        create: { ...p, consentToPublish: true, status: 'ACTIVE', country: 'NG' },
      }),
    ),
  )

  // -------------------------------------------------------------------------
  // Situation Room registration form + flagship event
  // -------------------------------------------------------------------------
  const registrationForm = await prisma.formDefinition.upsert({
    where: { slug: 'situation-room-2026-registration' },
    update: {},
    create: {
      name: 'The Situation Room 2026 — Registration',
      slug: 'situation-room-2026-registration',
      confirmationType: 'MESSAGE',
      confirmationMessage:
        "Your seat in the Situation Room is registered. A confirmation with full delegate briefing will follow by email.",
      notificationEmails: [SUPER_ADMIN_EMAIL],
      fields: [
        { id: 'fullName', type: 'text', label: 'Full name', required: true },
        { id: 'email', type: 'email', label: 'Email address', required: true },
        { id: 'phone', type: 'phone', label: 'Phone number', required: true },
        { id: 'country', type: 'country', label: 'Country', required: true },
        { id: 'organization', type: 'text', label: 'Organization', required: false },
        {
          id: 'pillar',
          type: 'dropdown',
          label: 'Which pillar best describes you?',
          required: true,
          options: ['Educator', 'Leader', 'Entrepreneur', 'Creative', 'Technocrat'],
        },
        { id: 'dietary', type: 'text', label: 'Dietary requirements', required: false },
        {
          id: 'consent',
          type: 'consent',
          label: 'I consent to being contacted regarding this event and future Kingdom E.L.E.C.T. programs.',
          required: true,
        },
      ],
    },
  })

  const situationRoomEvent = await prisma.event.upsert({
    where: { slug: 'the-situation-room-2026' },
    update: {},
    create: {
      title: 'The Situation Room 2026',
      slug: 'the-situation-room-2026',
      type: 'SITUATION_ROOM',
      summary:
        'A governance chamber convening Educators, Leaders, Entrepreneurs, Creatives, and Technocrats to diagnose, deliberate, and deploy Kingdom solutions for Africa.',
      description:
        'The annual convening of Kingdom E.L.E.C.T. for Africa — strategic Kingdom conversations, diagnostic roundtables, think tank sessions, policy and innovation dialogues, solution design labs, intergenerational mentorship, collaborative action planning, and Kingdom intelligence briefings, across three days.',
      startDate: new Date('2026-11-18T09:00:00+01:00'),
      endDate: new Date('2026-11-20T18:00:00+01:00'),
      timezone: 'Africa/Lagos',
      venueName: 'Transcorp Hilton, Abuja',
      venueCity: 'Abuja',
      venueCountry: 'NG',
      isVirtual: false,
      registrationFormId: registrationForm.id,
      capacity: 500,
      registrationStatus: 'OPEN',
      status: 'PUBLISHED',
      featuredOnHomepage: true,
    },
  })

  await Promise.all(
    speakerPeople.map((person) =>
      prisma.speaker.upsert({
        where: { eventId_personId: { eventId: situationRoomEvent.id, personId: person.id } },
        update: {},
        create: { eventId: situationRoomEvent.id, personId: person.id },
      }),
    ),
  )

  // -------------------------------------------------------------------------
  // Programs
  // -------------------------------------------------------------------------
  const fellowsProgram = await prisma.program.upsert({
    where: { slug: 'kingdom-fellows' },
    update: {},
    create: {
      title: 'Kingdom Fellows Program',
      slug: 'kingdom-fellows',
      summary: 'A twelve-month intergenerational mentorship pathway for emerging Kingdom influencers.',
      description:
        'The Kingdom Fellows Program pairs emerging change-makers with established Kingdom leaders across the Five, sustaining Africa\'s transformation across decades rather than isolated events.',
      pillarTags: ['EDUCATOR', 'LEADER', 'ENTREPRENEUR', 'CREATIVE', 'TECHNOCRAT'],
      status: 'OPEN_FOR_APPLICATIONS',
      featuredOnHomepage: true,
    },
  })

  const territorialLab = await prisma.program.upsert({
    where: { slug: 'territorial-reform-lab' },
    update: {},
    create: {
      title: 'Territorial Reform Lab',
      slug: 'territorial-reform-lab',
      summary: 'A solution-design cohort turning diagnostic intelligence into deployable territorial development plans.',
      description:
        'The Territorial Reform Lab takes the diagnostic output of the Situation Room and refines it, through collective intelligence, into scalable models for solving specific territorial challenges.',
      pillarTags: ['LEADER', 'TECHNOCRAT'],
      status: 'ONGOING',
      featuredOnHomepage: true,
    },
  })

  // -------------------------------------------------------------------------
  // Articles (Kingdom Intelligence / Insights)
  // -------------------------------------------------------------------------
  await prisma.article.upsert({
    where: { slug: 'diagnosis-before-solutions' },
    update: {},
    create: {
      title: 'Diagnosis Before Solutions: Why Africa Keeps Solving the Wrong Problem',
      slug: 'diagnosis-before-solutions',
      subtitle: 'The Situation Room begins with discernment, not discussion.',
      category: 'GOVERNANCE',
      excerpt:
        'Superior intelligence should produce superior execution — but only after root causes, not symptoms, have been correctly named.',
      body: 'Africa\'s developmental conversations are rarely short on ideas. What they lack, more often, is discernment...',
      pillarTags: ['LEADER', 'TECHNOCRAT'],
      relatedEventId: situationRoomEvent.id,
      status: 'PUBLISHED',
      featuredOnHomepage: true,
      publishedDate: new Date('2026-06-02'),
    },
  })

  await prisma.article.upsert({
    where: { slug: 'the-economics-of-kingdom-enterprise' },
    update: {},
    create: {
      title: 'The Economics of Kingdom Enterprise',
      slug: 'the-economics-of-kingdom-enterprise',
      subtitle: 'Why profit and purpose were never meant to compete.',
      category: 'ECONOMY',
      excerpt: 'Kingdom entrepreneurs steward economic resources for Kingdom advancement, not merely profit generation.',
      body: 'Every enterprise is a platform. The question is only ever what it is a platform for...',
      pillarTags: ['ENTREPRENEUR'],
      relatedProgramId: territorialLab.id,
      status: 'PUBLISHED',
      featuredOnHomepage: true,
      publishedDate: new Date('2026-05-14'),
    },
  })

  await prisma.article.upsert({
    where: { slug: 'curriculum-as-governance' },
    update: {},
    create: {
      title: 'Curriculum as Governance',
      slug: 'curriculum-as-governance',
      subtitle: 'Education shapes culture before culture shapes society.',
      category: 'EDUCATION',
      excerpt: 'Kingdom educators influence far more than classrooms — they shape the worldview a nation governs itself by.',
      body: 'Long before a policy is debated in a legislature, it has already been decided in a classroom...',
      pillarTags: ['EDUCATOR'],
      status: 'PUBLISHED',
      featuredOnHomepage: false,
      publishedDate: new Date('2026-04-22'),
    },
  })

  // -------------------------------------------------------------------------
  // Stories
  // -------------------------------------------------------------------------
  await prisma.story.upsert({
    where: { slug: 'from-classroom-to-cabinet' },
    update: {},
    create: {
      title: 'From Classroom to Cabinet',
      slug: 'from-classroom-to-cabinet',
      personFeaturedId: speakerPeople[0].id,
      summary: 'How one Kingdom Fellow moved from lecture hall to national curriculum policy in eighteen months.',
      body: 'When Adaeze first joined the Kingdom Fellows Program, she was leading a single department...',
      relatedProgramId: fellowsProgram.id,
      status: 'PUBLISHED',
      featuredOnHomepage: true,
      publishedDate: new Date('2026-07-01'),
    },
  })

  // -------------------------------------------------------------------------
  // Organizations / Partners
  // -------------------------------------------------------------------------
  await prisma.organization.upsert({
    where: { slug: 'continental-ventures-group' },
    update: {},
    create: {
      name: 'Continental Ventures Group',
      slug: 'continental-ventures-group',
      type: 'CORPORATE',
      description: 'A pan-African venture holding company investing in Kingdom-aligned enterprise.',
      country: 'GH',
      primaryContactId: speakerPeople[1].id,
      partnershipTier: 'Strategic',
      featuredOnHomepage: true,
    },
  })

  await prisma.organization.upsert({
    where: { slug: 'public-digital-infrastructure-office' },
    update: {},
    create: {
      name: 'Public Digital Infrastructure Office',
      slug: 'public-digital-infrastructure-office',
      type: 'GOVERNMENT',
      description: 'A national digital governance office partnering on ethical civic technology deployment.',
      country: 'NG',
      primaryContactId: speakerPeople[3].id,
      partnershipTier: 'Strategic',
      featuredOnHomepage: true,
    },
  })

  // -------------------------------------------------------------------------
  // Flagship page content
  // -------------------------------------------------------------------------
  await prisma.homePageContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroEyebrow: 'KINGDOM E.L.E.C.T. FOR AFRICA',
      heroHeading: 'The wealth of nations is not missing. It is ungoverned.',
      heroSubheading:
        'Kingdom E.L.E.C.T. for Africa convenes Educators, Leaders, Entrepreneurs, Creatives, and Technocrats to diagnose, govern, and unlock the wealth systems held within Africa\'s people, institutions, and territories.',
      heroPrimaryCtaLabel: 'Explore Kingdom E.L.E.C.T.',
      heroPrimaryCtaHref: '/about',
      heroSecondaryCtaLabel: 'Enter the Situation Room',
      heroSecondaryCtaHref: '/the-situation-room',
      momentEyebrow: "AFRICA'S DEFINING MOMENT",
      momentHeading: 'Prophecy, potential, and paradox, all at once.',
      momentBody:
        'Africa carries more material, human, institutional, and spiritual capital than at any point in her history, and still, so much of it sits latent, misaligned, or spiritually ungoverned. The question is no longer whether Africa is endowed. The question is who will govern what she already holds.',
      momentStats: [
        { value: '1.5B+', label: "people whose future is shaped by today's governance choices" },
        { value: '5', label: 'strategic spheres converging in one Situation Room' },
        { value: '54', label: 'nations, one continental Kingdom mandate' },
      ],
      frameworkHeading: 'The Kingdom Framework',
      frameworkIntro:
        'God transforms nations through transformed people who reform institutions and develop territories. It is a sequence, not a slogan.',
      frameworkSteps: [
        { label: 'People', description: 'Transformation begins in the inner life, character, and worldview of those who carry influence.' },
        { label: 'Institutions', description: 'Transformed people reform the systems and structures they lead, from classrooms to courts to boardrooms.' },
        { label: 'Territories', description: 'Reformed institutions develop the land, economies, and cities entrusted to them.' },
        { label: 'Nations', description: 'Developed territories accumulate into national transformation with Kingdom order at its center.' },
        { label: 'Generations', description: 'Sustained across an intergenerational movement, national transformation becomes a legacy that outlives its founders.' },
      ],
      fiveHeading: 'The Five',
      fiveIntro:
        'Educators, Leaders, Entrepreneurs, Creatives, and Technocrats represent the most strategic influence systems shaping the future of nations. Kingdom E.L.E.C.T. exists to convene them, not in isolation, but as one collective force.',
      situationRoomHeading: 'The Situation Room',
      situationRoomBody:
        'Not a conference. A governance chamber, convened to discern, diagnose, and deliberately unlock the wealth systems embedded within people, institutions, and territories.',
      intelligenceHeading: 'Kingdom Intelligence',
      intelligenceIntro: 'Research, briefings, and strategic perspective for those who govern spheres, not just attend events.',
      participationHeading: 'This is not a spectator movement.',
      participationBody:
        'Kingdom E.L.E.C.T. is built for those already producing measurable impact within their sphere, and ready to convert isolated excellence into collective influence.',
      participationCtaLabel: 'Get Involved',
      participationCtaHref: '/get-involved',
    },
  })

  await prisma.aboutPageContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroHeading: 'A governance chamber, not a gathering.',
      heroBody:
        'Kingdom E.L.E.C.T. for Africa exists to convene, equip, and align Kingdom-minded leaders across strategic spheres, to transform Africa by reforming people, strengthening institutions, and developing territories according to God\'s purposes.',
      storyHeading: 'Why E.L.E.C.T.',
      storyBody:
        'E.L.E.C.T. represents Educators, Leaders, Entrepreneurs, Creatives, and Technocrats — five communities that shape the future of nations long before policy catches up to them. Rather than gathering professionals, Kingdom E.L.E.C.T. convenes men and women already producing measurable impact within their sphere, ready to trade isolated excellence for collective influence.',
      visionStatement:
        'To see an Africa where transformed people, reformed institutions, and developed territories reflect the wisdom, righteousness, innovation, and excellence of the Kingdom of God.',
      missionStatement:
        'To build a continental ecosystem where educators, leaders, entrepreneurs, creatives, and technocrats collaborate through Kingdom intelligence to diagnose societal challenges, design transformational solutions, and catalyze measurable change across Africa.',
      purposeStatement:
        'To convene, equip, and align Kingdom-minded leaders across strategic spheres to transform Africa by reforming people, strengthening institutions, and developing territories according to God\'s purposes.',
      essenceStatement: "Mobilizing Kingdom Influence for Africa's Transformation.",
      objectives: [
        { title: 'Build a Kingdom Community of Reformers', body: 'Create a trusted network of educators, leaders, entrepreneurs, creatives, and technocrats who share a common burden for national transformation.' },
        { title: "Diagnose Africa's Greatest Challenges through a Kingdom Lens", body: 'Facilitate deep, evidence-based conversations that identify root causes rather than symptoms.' },
        { title: 'Develop Scalable Kingdom Solutions', body: 'Refine existing initiatives through collective intelligence into models that are Kingdom-inspired, contextually African, globally competitive, and practically implementable.' },
        { title: 'Generate Strategic Intelligence for National Transformation', body: 'Synthesize research, prophetic insight, and practical knowledge into actionable frameworks for institutions, governments, and communities.' },
        { title: 'Raise a New Generation of Kingdom Influence', body: 'Mentor and connect emerging change-makers with established Kingdom leaders across decades, not isolated events.' },
        { title: 'Reposition Africa as a Kingdom Innovation Hub', body: 'Champion solutions conceived by Africans, built for Africa, and capable of serving the world.' },
      ],
      personality: [
        { trait: 'Wise' }, { trait: 'Strategic' }, { trait: 'Convictional' }, { trait: 'Excellent' },
        { trait: 'Visionary' }, { trait: 'Collaborative' }, { trait: 'Hopeful' }, { trait: 'Courageous' },
      ],
    },
  })

  await prisma.situationRoomPageContent.upsert({
    where: { id: 1 },
    update: { featuredEventId: situationRoomEvent.id },
    create: {
      id: 1,
      heroHeading: 'The Situation Room',
      heroSubheading: 'A governance chamber for Kingdom intelligence and strategic action.',
      philosophyStatement: 'God transforms nations through transformed people who reform institutions and develop territories.',
      functions: [
        { title: 'Diagnostic Altar', body: 'For people, institutions, and territories — naming root causes, not symptoms.' },
        { title: 'Strategic Council', body: 'For Kingdom actors in spheres, converting insight into coordinated action.' },
        { title: 'Prophetic Intelligence Hub', body: 'Where spiritual discernment informs strategic execution.' },
        { title: 'Coalition Incubator', body: 'For Kingdom transformation systems that outlast any single gathering.' },
      ],
      sessionTypes: [
        'Strategic Kingdom Conversations', 'Diagnostic Roundtables', 'Think Tank Sessions',
        'Policy and Innovation Dialogues', 'Solution Design Labs', 'Intergenerational Mentorship Conversations',
        'Collaborative Action Planning', 'Kingdom Intelligence Briefings',
      ],
      outcomes: [
        'A continental network of Kingdom reformers', 'Actionable policy and innovation recommendations',
        'Collaborative cross-sector partnerships', 'Scalable African solutions to African challenges',
        'A repository of Kingdom intelligence for national transformation',
        'Emerging leaders equipped for influence across strategic sectors',
        'Long-term initiatives that transform institutions, communities, and nations',
      ],
      featuredEventId: situationRoomEvent.id,
    },
  })

  await prisma.theFivePageContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heading: 'The Five',
      intro:
        'Rather than isolated excellence, Kingdom E.L.E.C.T. promotes collective influence. Each pillar carries its own mandate. Together, they move nations.',
      pillars: [
        {
          key: 'EDUCATOR', name: 'Educators',
          tagline: 'Shaping minds. Raising solutions.',
          body: "Kingdom Educators are responsible for raising minds, developing character, and producing knowledge that aligns with God's purpose for humanity. They influence curriculum, learning systems, research, policy, and human capital development, ensuring education produces transformational leaders rather than merely graduates.",
          sphereOfInfluence: ['Curriculum', 'Learning systems', 'Research', 'Policy', 'Human capital development'],
        },
        {
          key: 'LEADER', name: 'Leaders',
          tagline: 'Stewarding influence. Driving change.',
          body: 'Kingdom Leaders are called to steward with integrity, justice, wisdom, and servant leadership. Through strategic influence across the five-fold, they further Kingdom principles and systems that reflect righteousness and alignment to God\'s agenda.',
          sphereOfInfluence: ['Governance', 'Institutional strategy', 'Public policy', 'Church leadership'],
        },
        {
          key: 'ENTREPRENEUR', name: 'Entrepreneurs',
          tagline: 'Building value. Creating opportunities.',
          body: 'Kingdom Entrepreneurs build enterprises that solve real problems, create employment, generate prosperity, and steward economic resources for Kingdom advancement. Their businesses become platforms for transformation rather than merely profit generation.',
          sphereOfInfluence: ['Enterprise', 'Employment', 'Capital stewardship', 'Economic innovation'],
        },
        {
          key: 'CREATIVE', name: 'Creatives',
          tagline: 'Shaping culture. Communicating truth.',
          body: "Kingdom Creatives shape imagination, values, and identity through media, arts, storytelling, music, design, entertainment, and communication. They redefine narratives, inspire hope, and present Africa's story through excellence, truth, and beauty.",
          sphereOfInfluence: ['Media', 'Arts', 'Storytelling', 'Design', 'Entertainment'],
        },
        {
          key: 'TECHNOCRAT', name: 'Technocrats',
          tagline: 'Designing systems. Building the future.',
          body: 'Kingdom Technocrats leverage science, engineering, governance, digital innovation, and emerging technologies to solve complex societal problems, improve public systems, and accelerate Africa\'s participation in the global knowledge economy, while maintaining ethical, Kingdom-centred innovation.',
          sphereOfInfluence: ['Science & engineering', 'Digital infrastructure', 'Public systems', 'Emerging technology'],
        },
      ],
    },
  })

  console.log('\nSeed complete.')
  console.log(`Super admin login → ${SUPER_ADMIN_EMAIL} / ${SUPER_ADMIN_PASSWORD}`)
  console.log('Change this password after first login.\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
