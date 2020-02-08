export const dateFilterRouteList = [
  { url: "today", name: "Today", icon: "", type: "" },
  { url: "this-week", name: "This week", icon: "", type: "" },
  { url: "next-week", name: "Next week", icon: "", type: "" }
];

export const mainFilterRouteList = [{ url: "all", name: "All", icon: "" }];

export const mainRouteList = [
  { url: "/", name: "Home", icon: "home" },
  { url: "/simulations", name: "Simulations", icon: "info" },
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
