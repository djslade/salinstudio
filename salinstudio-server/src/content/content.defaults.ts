import { AboutContent, CvContent } from './content.types';

// Seeded into the setting table on first boot so the live site keeps the
// content that used to be hard-coded in the client's About page.

export const DEFAULT_ABOUT: AboutContent = {
  paragraphs: [
    {
      en: 'I’m a hardworking artist from Finland with limitless imagination and drive. I’ve come a long way for this path, but my hardships have just made my determination stronger.',
      fi: 'Olen suomalainen taiteilija, jonka mielikuvitus ja luomisvimma tuntuvat ehtymättömiltä. Matkani tähän asti ei ole ollut helppo, mutta jokainen vastoinkäyminen on vain vahvistanut päättäväisyyttäni ja intohimoani taiteeseen.',
    },
    {
      en: 'I enjoy drawing with pencil, coal and using oil paints. I also make some digital art at times, and have great interest in animation and 3D art. I’m a great listener and learn fast. I enjoy surrealism, symbolism, real life experiences and stories. I want to capture the feeling and raw emotion in whatever or whoever I make art of.',
      fi: 'Työskentelen mielelläni lyijykynällä, hiilellä ja öljyväreillä. Teen toisinaan myös digitaalista taidetta, ja minua kiehtovat erityisesti animaatio sekä 3D-taide. Opin nopeasti, kuuntelen tarkasti ja ammennan inspiraatiota surrealismista, symbolismista, tosielämän kokemuksista ja tarinoista. Pyrin aina tavoittamaan tunteen ja aidon elämyksen riippumatta siitä, mitä tai ketä kuvitan.',
    },
    {
      en: 'Being international is very important to me, and I’m hoping to gain new experiences and opportunities outside of Finland too. I’m very sensitive to different situations that people might be in, and I will make it as easy as possible to contact me and request artworks. Follow me on [Instagram](https://www.instagram.com/salinmiia/) to stay up to date with my work.',
      fi: 'Kansainvälisyys on minulle tärkeää, ja haluan löytää uusia kokemuksia ja mahdollisuuksia myös Suomen rajojen ulkopuolelta. Olen herkkä huomaamaan erilaisia elämäntilanteita, ja haluan, että minuun on helppo ottaa yhteyttä ja tilata taidetta. Seuraa minua [Instagramissa](https://www.instagram.com/salinmiia/), jos haluat pysyä ajan tasalla uusista töistäni.',
    },
  ],
};

export const DEFAULT_CV: CvContent = {
  categories: [
    {
      titleEn: 'Group Exhibitions',
      titleFi: 'Ryhmänäyttelyt',
      entries: [
        { year: 2025, textEn: 'Café Papulaari', textFi: 'Kahvila Papulaari' },
        {
          year: 2023,
          textEn: 'Kouvola Kohoa Synergy Center',
          textFi: 'Kouvolan Kohoa Synergiakeskus',
        },
      ],
    },
    {
      titleEn: 'Solo Exhibitions',
      titleFi: 'Yksityisnäyttelyt',
      entries: [
        {
          year: 2025,
          textEn: 'Bar Café Columbia',
          textFi: 'Bar Café Columbia',
        },
      ],
    },
    {
      titleEn: 'Commissioned Works',
      titleFi: 'Tilaustyöt',
      entries: [
        {
          year: 2025,
          textEn: 'Oil portrait painting of a mother',
          textFi: 'Muotokuva öljyvärimaalaus äidistä',
        },
        {
          year: 2024,
          textEn: 'Portrait drawing of a couple',
          textFi: 'Muotokuvapiirros pariskunnasta',
        },
        {
          year: 2024,
          textEn: 'Pet portrait drawing',
          textFi: 'Muotokuvapiirros lemmikistä',
        },
      ],
    },
    {
      titleEn: 'Other Participations',
      titleFi: 'Muut osallistumiset',
      entries: [
        {
          year: 2025,
          textEn:
            'Participated in the MHAW Mielipolku 2025 community project with two digital artworks. The works were displayed along the forest path at Kouvola Ratamo Medical Center, created for the benefit of patients and visitors alike',
          textFi:
            'Olen ottanut osaa MHAW mielipolun 2025 yhteishyvän projektiin kahdella digitaalisella teoksella. Teoksia käytettiin Kouvolan Ratamon lääkärikeskuksen metsäpolulla potilaiden, sekä muiden hyväksi.',
        },
        {
          year: 2024,
          textEn: 'Acrylic painting of the KooKoo logo for a business space.',
          textFi: 'Akryylimaalaus KooKoon logosta yrittäjän tilaan.',
        },
      ],
    },
  ],
};
