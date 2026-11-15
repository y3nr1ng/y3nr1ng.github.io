// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-home",
    title: "Home",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "projects-not-envi",
          title: 'not-envi',
          description: "A browser-based hyperspectral viewer, from spatial images to spectra and quantitative measurements.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/not-envi/";
            },},{id: "projects-scopeengine-cimicroscope",
          title: 'ScopeEngine / ciMicroscope',
          description: "Acquisition software connecting microscope workflows with vendor-specific instruments.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/scopeengine/";
            },},{id: "projects-simscope",
          title: 'SimScope',
          description: "Virtual optical benches with explicit physical models and inspectable simulation results.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/simscope/";
            },},{id: "projects-videoeditor",
          title: 'VideoEditor',
          description: "Local browser editing for experiment recordings and presentation videos.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/video-editor/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%74%6C%69%75%32@%69%6C%6C%69%6E%6F%69%73.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/y3nr1ng", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/y3nr1ng", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0002-5768-0516", "_blank");
        },
      },{
        id: 'social-researchgate',
        title: 'ResearchGate',
        section: 'Socials',
        handler: () => {
          window.open("https://www.researchgate.net/profile/Yen-Ting-Liu-3/", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
