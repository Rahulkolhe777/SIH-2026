CONTINUE THE EXISTING AGROVIA WEBSITE.

This is PHASE 2.

DO NOT redesign Phase 1.
DO NOT replace the existing visual system.
DO NOT change the navbar, hero, trust strip, platform section or farming solutions section.

Continue the same exact design language.

==================================================
PHASE 2 SECTION 1 — HOW IT WORKS
==================================================

Create a large section labeled:

"• How It Works"

Main heading:

"Smart Farming Made
Simple and Efficient"

First line:
modern sans

Second line:
elegant italic serif

To the right:

"A smart farming platform that connects soil,
crops, and operations to help farmers grow
more efficiently and safely."

Keep the same typography and spacing system from Phase 1.

--------------------------------------------------
FOUR FEATURE TABS
--------------------------------------------------

Below the heading create four horizontal tab cards:

1. Overview
   Real-Time Insights

2. Smart Planning
   Precision Planning

3. Farm Control
   Total Management

4. Field Monitor
   Growth Tracker

Each tab:
- light gray background
- rounded corners around 12–14px
- approximately equal width
- icon on left
- title
- smaller subtitle
- generous internal padding

Selected tab:
- subtle lime/yellow highlight behind icon
- slightly stronger text
- no heavy border

Hover:
- card moves upward 1–2px
- background subtly changes
- icon background transitions

--------------------------------------------------
LARGE IMAGE PANEL
--------------------------------------------------

Under the tabs place a very large rounded image panel.

Approximately:
width: 100%
height: 520px desktop

Border radius:
approximately 24px

Image:
A cinematic agricultural field.

Central subject:
A farmer viewed from behind, walking through rows of crops.

Lighting:
- warm late afternoon / golden hour
- rich green crops
- warm yellow sunlight
- wide agricultural landscape

At bottom-left of image:

small location indicator icon

"Dhaka, Bangladesh"

White text.

--------------------------------------------------
FLOATING WEATHER CARD
--------------------------------------------------

Position a white dashboard card over the bottom-right portion of the image.

Card:
- white
- rounded 18px
- subtle shadow
- approximately 255 × 180px
- desktop

Inside:

weather icon:
small partly cloudy/rain icon

"24°C"

"Today's Avg Temperature"

Then a horizontal metric row:

68%
Humidity

20%
Precipitation

12 km/h
Wind Speed

Use very small labels.

--------------------------------------------------
FLOATING AI CARD
--------------------------------------------------

Directly below/overlapping the weather card:

White compact card.

Title:
"Area Prediction AI Model"

Right side:
"Good for planting"

Underneath:
horizontal risk/planting indicator.

The indicator consists of many small vertical/rounded bars transitioning visually from:
red/orange → yellow → pale green → green.

Below:

green square icon with:
"AI"

Text:
"Farma AI helps optimize crop fields"

Right arrow:
→

Card should be approximately 255 × 105px.

--------------------------------------------------
IMAGE ANIMATION
--------------------------------------------------

When this section enters viewport:
- image scales from 1.04 → 1
- opacity 0 → 1
- floating cards enter from the right
- weather card translateX(25px) → 0
- AI card translateX(35px) → 0
- stagger them by approximately 100ms

During scrolling:
- image has subtle parallax
- floating cards move slightly slower than the image

Do NOT make this animation obvious.

--------------------------------------------------
TAB INTERACTION
--------------------------------------------------

Clicking tabs changes the main image and dashboard state.

Overview:
general field image

Smart Planning:
planning/farm-management image

Farm Control:
farmer + operational farm image

Field Monitor:
crop monitoring image

Use crossfade + subtle scale transition.

==================================================
PHASE 2 SECTION 2 — STATISTICS
==================================================

Immediately below the large image create four statistics cards.

Four equal cards:

1.
"1.5M+"
"Acres Monitored"

2.
"200+"
"Farmers Empowered"

3.
"2M+"
"Farm Decisions Optimized"

4.
"750K+"
"Successful Harvests"

Cards:
- light gray background
- rounded 16px
- approximately 130–160px height
- centered text

Numbers:
- large
- dark green
- approximately 38–44px

Labels:
- muted gray-green
- approximately 14px

--------------------------------------------------
STAT NUMBER ANIMATION
--------------------------------------------------

Numbers should animate when the section first enters the viewport.

Example:
0 → 1.5M+
0 → 200+
0 → 2M+
0 → 750K+

Use a smooth count-up animation lasting approximately 1.2–1.6 seconds.

Do not count continuously.

Trigger only when entering viewport.

==================================================
PHASE 2 SECTION 3 — SMART SOLUTIONS
==================================================

Create a section labeled:

"• Smart Farming"

Heading:

"Smart Solutions for
Modern Farming"

Again:
modern sans first line
editorial italic serif second line.

Right side paragraph:

"We empower farmers with intelligent tools and data-driven
insights to increase yields, reduce costs, and build a more
sustainable agricultural future."

--------------------------------------------------
HORIZONTAL SOLUTION CARD CAROUSEL
--------------------------------------------------

Below the heading create a horizontal card carousel.

The reference has three large image cards visible simultaneously on desktop.

Cards are approximately:
370–420px wide
420–500px total height

Each has:
- large rounded image
- approximately 22px radius
- title underneath
- description underneath

CARD 1:
Image:
farmer working manually among crops.

Title:
"Precision Crop Management"

Description:
"Track soil, crops, and weather in real time for better decisions
and higher yields."

CARD 2:
Image:
young farmer using a tablet in a crop field.

Title:
"Smart Farm Automation"

Description:
"Automate irrigation and operations to save time, cut costs,
and boost efficiency."

CARD 3:
Image:
older farmer in agricultural field.

Title:
"Sustainable Agriculture"

Description:
"Protect soil, conserve resources, and grow healthier crops
for the long term."

Additional cards may exist horizontally outside the viewport.

--------------------------------------------------
CAROUSEL BEHAVIOR
--------------------------------------------------

IMPORTANT:
This is NOT a normal grid.

The cards form a horizontal moving carousel.

At different moments, the visible cards shift horizontally.

Implement:
- horizontal track
- smooth translateX
- overflow hidden
- cards remain fixed-size
- next cards enter from the right
- previous cards leave left
- continuous/infinite loop

The movement should be slow and editorial.

When scrolling into this section:
cards enter with a slight stagger:
- first card from left
- second card from slightly lower/right
- third card from right

After entering:
the carousel can slowly auto-advance.

Hovering a card:
- slightly scale image
- approximately 1.02
- title remains stable
- transition around 500ms

Do NOT use aggressive carousel movement.

On mobile:
show approximately one card at a time with partial next-card visibility.

==================================================
PHASE 2 SECTION 4 — TESTIMONIALS
==================================================

Create a large section labeled:

"• Testimonials"

Heading:

"Real Stories Shared
by Our Farmers"

Second line:
"by Our Farmers"
must be elegant italic serif.

Right-side paragraph:

"Hear directly from farmers who use our solutions every
day and see real impact across their fields and harvests."

--------------------------------------------------
TESTIMONIAL CARDS
--------------------------------------------------

Create a horizontal testimonial carousel.

Two large testimonial cards are visible on desktop.

Each card:
- very light gray background
- approximately 680px wide
- approximately 320px tall
- rounded 18px
- subtle shadow/border

Inside each card:
- oversized pale quotation mark in upper-left
- testimonial text
- farmer name
- farm/company and location
- "Read more  ›"
- farmer photograph on right

First testimonial:

"The platform was easy to implement and delivered value fast. Within the
first month, we improved irrigation planning and reduced input costs
significantly."

Name:
Michael Thompson

Company:
AgroField, Iowa

Second:

"Real-time field data completely changed how we manage our crops.
We're making smarter decisions and seeing healthier yields season after
season."

Name:
Sarah Williams

Company:
CropSense, California

Additional testimonial examples:

Daniel Carter
GreenRoot Farms, Texas

"The automation tools helped us reduce water waste while keeping
crop quality consistent across every season. The results have been
outstanding."

Emma Rodriguez
HarvestLine, California

"Managing our farm operations became much easier with real-time
monitoring and predictive insights. We now save time and improve
productivity daily."

--------------------------------------------------
TESTIMONIAL NAVIGATION
--------------------------------------------------

Below/right of carousel:

Two circular arrow buttons:
←
→

Buttons:
- white
- thin subtle border
- approximately 42px × 42px
- circular
- very subtle shadow

Hover:
- arrow moves 2px
- background changes subtly

Click:
carousel slides horizontally.

Animation:
- 600–800ms
- ease-out
- no abrupt snapping

The cards should slide as a group.

--------------------------------------------------
COMPANY FILTER / LABELS
--------------------------------------------------

Under testimonial cards place a small horizontal list:

AgroField
CropSense
TerraGrow
FieldLogic
FarmSync

First/current:
dark green

Others:
muted gray

Clicking a company can select its testimonial.

Transition:
fade + horizontal movement.

==================================================
PHASE 2 SECTION 5 — FAQ
==================================================

Create a large centered FAQ section.

At the top center:

"• FAQ"

Then:

"Common Farmer Questions"

"Common Farmer"
uses modern sans.

"Questions"
uses elegant italic serif.

Below:

"Got questions? We've got answers to help you get the most
out of Agrovia."

Centered.

==================================================
FAQ ACCORDION
==================================================

Create a centered FAQ list approximately 810px wide on desktop.

Five rows:

1.
"Does Agrovia support sustainable farming?"

2.
"Can I monitor multiple fields at once?"

3.
"How do I get started with Agrovia?"

4.
"Is Agrovia easy to use for non-technical farmers?"

5.
"Can Agrovia help reduce farming costs?"

Each closed row:
- light gray/off-white background
- subtle border
- rounded approximately 14px
- height around 78px
- question aligned left
- plus button aligned right

Plus button:
- tiny white square
- subtle border
- approximately 24px
- rounded 5px
- centered +

--------------------------------------------------
OPEN FAQ STATE
--------------------------------------------------

When opened:

Row becomes taller.

Question stays at top.

Answer appears underneath.

Example answer:

"Yes. Agrovia helps farmers adopt sustainable practices through smart
resource management, efficient irrigation, and data-driven insights that
reduce waste and improve crop health."

The plus icon changes to a minus.

IMPORTANT:
Active minus button has:
- dark/medium green background
- white/light minus icon

Animation:
- row height smoothly expands
- answer opacity 0 → 1
- answer translateY(-5px) → 0
- duration approximately 350–450ms

Only one FAQ should be open at a time.

--------------------------------------------------
FAQ CLICK BEHAVIOR
--------------------------------------------------

When clicking another question:
1. current answer closes
2. current icon changes minus → plus
3. new answer opens
4. new icon changes plus → minus
5. entire movement is smooth

No page jump.

==================================================
GLOBAL ANIMATION LANGUAGE FOR PHASE 2
==================================================

All animations must feel like premium Webflow/Framer-style motion.

Use:
- ease-out
- cubic-bezier curves
- 450–900ms durations
- small distances
- opacity + transform
- subtle scale

Never:
- bounce
- spin
- flash
- excessive blur
- huge movement
- elastic animations

Images:
scale 1.03 → 1

Text:
translateY 20px → 0

Cards:
translateY 20px → 0

Floating UI:
translateX 20px → 0

Stagger:
60–120ms

==================================================
PAGE SCROLL EXPERIENCE
==================================================

The entire site should feel like one continuous editorial story.

Sections should have generous whitespace.

When scrolling:
- previous section leaves smoothly
- next section reveals naturally
- background image behind the main website remains subtly visible around the outer edges
- inner website remains clean white/warm white

The user should NEVER feel like they're moving between disconnected template sections.

==================================================
RESPONSIVE DESIGN
==================================================

Desktop 1440px:
- full two-column layouts
- large cards
- horizontal carousels

Tablet:
- reduce heading sizes
- reduce gaps
- preserve two-column layouts when possible

Mobile 390px:
- everything becomes one column
- no horizontal page overflow
- horizontal carousels are internally scrollable
- testimonial shows one card
- solution carousel shows one card + partial next card
- FAQ full width with approximately 16–20px side margins
- floating dashboard cards resize and remain inside image
- hero buttons stack if necessary
- hero typography approximately 42px
- headings remain elegant and not oversized

==================================================
FINAL VISUAL QA
==================================================

After Phase 2 is complete, inspect the ENTIRE PAGE from top to bottom.

Do NOT simply verify that it works.

Perform a visual refinement pass.

Check:
- typography
- font pairing
- line breaks
- section spacing
- card dimensions
- image crop
- border radius
- button sizes
- icon sizes
- alignment
- carousel movement
- accordion animation
- testimonial transitions
- number counter
- scroll reveal
- parallax
- mobile responsiveness

The final result should look like a professionally art-directed premium agricultural SaaS landing page.

The most important priorities are:

1. SPACING
2. TYPOGRAPHY
3. IMAGE COMPOSITION
4. ANIMATION TIMING
5. CARD PROPORTIONS
6. RESPONSIVE BEHAVIOR
7. MICRO-INTERACTIONS

Do not add extra sections that were not specified.

Do not add a generic footer.

Do not add random content.

Finish by running the complete application and fixing any visual inconsistencies you find.