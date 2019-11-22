export const dateFilterRouteList = [
  { url: "today", name: "Today", icon: "", type: "" },
  { url: "this-week", name: "This week", icon: "", type: "" },
  { url: "next-week", name: "Next week", icon: "", type: "" }
];

export const mainFilterRouteList = [
  { url: "all", name: "All (${length})", icon: "" },
  { url: "accepted", name: "Accepted (${length})", icon: "", type: "" }
];

export const mainRouteList = [
  { url: "/", name: "Home", icon: "home" },
  { url: "/info", name: "About", icon: "info" }
];

export const adminRoute = {
  url: "/admin",
  name: "Admin",
  icon: "settings_applications"
};

export const logoutRoute = {
  url: "/logout",
  name: "Log Out",
  icon: "exit_to_app"
};

export const locations = [
  {
    neighborhood: `Squirrel Hills`,
    businessName: `The Chocolate Moose`,
    addressText: `5830 Forbes Ave, Pittsburgh, PA 15217`,
    lat: 40.4378,
    long: -79.9217
  },
  {
    neighborhood: `Greenfield`,
    businessName: `HQ`,
    addressText: `932 Mirror st. Pittsburgh PA 15217`,
    lat: 40.42663,
    long: -79.931566
  },
  {
    neighborhood: `Mt Lebanon`,
    businessName: `Oliver Rose Events`,
    addressText: `143 Beverly Rd, Pittsburgh, PA 15216`,
    lat: 40.39255,
    long: -80.046667
  },
  {
    neighborhood: `Sewickley`,
    businessName: `Adesso Cafe`,
    addressText: `441 1/2 Walnut Street, Sewickley, PA 15143`,
    lat: 40.54112,
    long: -80.18186
  },
  {
    neighborhood: `Ross Township`,
    businessName: `The Tiny Bookstore`,
    addressText: `1130 Perry Hwy Suite 106, Pittsburgh, PA 15237,`,
    lat: 40.547688,
    long: -80.03554
  },
  {
    neighborhood: `Butler`,
    businessName: `Lightning Hair Lounge`,
    addressText: `456 Pittsburgh Rd, Butler, PA 16002`,
    lat: 40.774142,
    long: -79.928837
  },
  {
    neighborhood: `Brookline`,
    businessName: `Thrive on health`,
    addressText: `730 Brookline Blvd, Pittsburgh, PA 15226`,
    lat: 40.394082,
    long: -80.020851
  },
  {
    neighborhood: `Strip District`,
    businessName: `Salems`,
    addressText: `2923 Penn Ave, Pittsburgh, PA 15201`,
    lat: 40.458475,
    long: -79.973756
  },
  {
    neighborhood: `Upper Lawrenceville`,
    businessName: `Spruce & Adorn (inside Ineffable)`,
    addressText: `3920 Penn Ave, Pittsburgh, PA 15224`,
    lat: 40.464654,
    long: -79.959291
  },
  {
    neighborhood: `Lower Lawrenceville`,
    businessName: `Hippie and French`,
    addressText: `5122 Butler St, Pittsburgh, PA 15201`,
    lat: 40.478912,
    long: -79.955084
  },
  {
    neighborhood: `East Liberty(ish)`,
    addressText: `East End coop: 7516 Meade St, Pittsburgh, PA 15208`,
    lat: 40.462559,
    long: -79.92185
  }
];

export const notifications = [
  `DEC 3RD: Card writing party (location JCC, but more details to come)`,
  `DEC 10TH: First assembling party (still looking for a location)`,
  `JAN 4TH: Farewell assembling party  at Union Project Building`,
  `From noon to 8pm | 801 N Negley Ave, Pittsburgh, PA 15206`
];

export const waiver = `
Volunteer Waiver:
I, _______________________________________ (please PRINT name), being ⎕ over 18 years of age and competent ⎕ under 18 years of age, have agreed to act as a volunteer for Worth Manifesto, a non-profit organization, in its charitable endeavors to help marginalized women, specifically homeless and displaced at the border.
I understand that any act I do is done by me entirely as a volunteer, rather than as an agent, employee, or independent contractor of Worth Manifesto.
I agree that I will not look to Worth Manifesto for my personal safety measures even when performing tasks while I am acting as a volunteer.
I waive any right to make a claim against Worth Manifesto for any injury, personal or otherwise, that I may suffer when I am acting as a volunteer.
I agree to defend fully and to indemnify Worth Manifesto in any claim that may be made against it for any injury, personal or otherwise, arising from my volunteer activities.
I consent and authorize Worth Manifesto to use and reproduce in any form, style or color, together with any writing, any photographs or other likeness of me taken in my capacity as a volunteer and circulated for the purposes of Worth Manifesto.
This consent and release is given without limitation upon any internal or external use for advertising, promotion, illustration, or any other purpose, in print publication, audio-visual presentation, digital or electronic media or any other medium.
I further waive any right to inspect or approve the commercial, advertising or other materials. I agree that such photograph or likeness remains the exclusive property of Worth Manifesto.
Additionally, I waive any right to royalties or other compensation arising or related to the use of the photograph.
I release Worth Manifesto from any and all liability related to use and dissemination of my photograph or likeness. _______________________________________________ _____________________________________
`;

export const editableSchemas = [
  {
    modelName: "volunteerings",
    resource: { defaultValue: "volunteerings" }
  }
];
