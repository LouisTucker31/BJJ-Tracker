/**
 * technique-picker.js
 * Custom slide-up picker panel for technique selection.
 * Supports multiple selection, stays open until Done.
 */

const TechniquePicker = (() => {

  const TECHNIQUES_DATA = {
    categories: [
      {
        id: "guards", name: "Guards", icon: "🛡️",
        techniques: [
          { id: "g1",  name: "Closed Guard",        description: "Legs locked around opponent's waist",       detail: "The most fundamental guard in BJJ. Your legs wrap around your opponent's waist and lock at the ankles, controlling distance and limiting their posture. From here you can attack with sweeps, chokes, and armlocks while neutralising their passing attempts." },
          { id: "g2",  name: "Half Guard",           description: "One leg trapped between yours",             detail: "You control one of your opponent's legs between both of yours, creating a transitional position between closed guard and being passed. Half guard is a fighting position — you're constantly working for an underhook to recover full guard or come up for a takedown." },
          { id: "g3",  name: "Deep Half Guard",      description: "Underhooking the leg from half guard",      detail: "A dynamic half guard variation where you slide under your opponent and underhook their far leg. From deep half you have strong sweep options including the waiter sweep and back take. It requires good hip mobility and the ability to invert under pressure." },
          { id: "g4",  name: "Butterfly Guard",      description: "Feet hooked inside opponent's thighs",      detail: "A seated guard where both feet are hooked inside your opponent's thighs like butterfly wings. The hooks create powerful lift for sweeps and the position naturally facilitates back takes. Works well against opponents who posture tall or try to stack you." },
          { id: "g5",  name: "X-Guard",              description: "Two-point control under opponent",           detail: "An open guard where you sit underneath your opponent and control them with two hooks — one on the hip and one around the far leg. X-guard creates excellent off-balancing leverage and is a strong platform for sweeps and stand-ups." },
          { id: "g6",  name: "Single Leg X",         description: "One leg controlled with body under",        detail: "Also called Ashi Garami in some systems. You control one leg with a figure-four-style grip while your body is positioned under your opponent. It's the primary entry point for heel hooks and knee bars in modern leg lock systems." },
          { id: "g7",  name: "Spider Guard",         description: "Sleeve grips with feet on biceps",          detail: "A gi-specific guard where you grip both sleeves and place your feet on your opponent's biceps. The combination of push and pull creates tremendous control over their posture and arms, opening up triangles, omoplatas, and sweeps." },
          { id: "g8",  name: "Lasso Guard",          description: "Leg wrapped around opponent's arm",         detail: "A gi guard where you thread your leg around your opponent's arm and grip their sleeve, creating a tight binding that disrupts their base. The lasso is very difficult to break and sets up sweeps, triangles, and omoplatas effectively." },
          { id: "g9",  name: "De La Riva Guard",     description: "Outside hook on lead leg",                  detail: "Named after Ricardo De La Riva, this guard uses an outside hook on your opponent's lead leg combined with sleeve or ankle grips. It's a highly versatile open guard used as a launching pad for sweeps, back takes, and the berimbolo." },
          { id: "g10", name: "Reverse De La Riva",   description: "Inside hook on lead leg",                   detail: "The mirror of De La Riva — your hook goes to the inside of your opponent's lead leg rather than the outside. RDLR is commonly used as a counter when opponents try to pass the DLR, and sets up back takes and leg lock entries." },
          { id: "g11", name: "Worm Guard",           description: "Lapel threaded through De La Riva",         detail: "A lapel-based guard invented by Keenan Cornelius. You feed your opponent's own lapel through your De La Riva hook, creating an incredibly tight bind. The worm guard is nearly impossible to pass and offers powerful sweeps and back takes." },
          { id: "g12", name: "Inverted Guard",       description: "Upside down guard position",                detail: "A fluid guard played by inverting your body, placing your hips above your head and facing away from your opponent. It's used primarily as a transitional position to recover guard, enter leg locks, or set up the berimbolo back take sequence." },
          { id: "g13", name: "Rubber Guard",         description: "High closed guard with leg control",        detail: "Popularised by Eddie Bravo, the rubber guard requires significant flexibility. You bring your leg high up around your opponent's arm and neck to control their posture. This opens up unorthodox submission chains not found in traditional closed guard." },
          { id: "g14", name: "93 Guard",             description: "Shin across opponent's hip",                detail: "A guard position where your shin sits across your opponent's hip to control distance and disrupt their passing. It acts as a frame and connection point, often used to transition into other open guards or to create space for sweeps." },
          { id: "g15", name: "Sit-Up Guard",         description: "Seated guard with underhook",               detail: "A proactive guard where you sit up into your opponent rather than staying flat on your back. By fighting for an underhook from this position you can convert to a single leg takedown, a back take, or return to butterfly guard." },
          { id: "g16", name: "Squid Guard",          description: "Lapel-based guard control",                 detail: "A lapel guard variation where you feed the lapel across your opponent's body and combine it with a leg hook to create strong rotational control. It offers reliable sweep options and is effective against passes that pressure forward." }
        ]
      },
      {
        id: "passes", name: "Guard Passes", icon: "➡️",
        techniques: [
          { id: "p1",  name: "Torreando Pass",       description: "Pushing legs aside to pass",               detail: "A standing pass where you grip both of your opponent's ankles or pants and redirect their legs to one side as you step around them. The torreando is fast and works well against open guards. Good hip movement and timing are key — if you're slow the guard player will re-engage." },
          { id: "p2",  name: "Knee Slice Pass",      description: "Knee cutting through half guard",           detail: "You drive your knee across your opponent's thigh in a slicing motion to clear their guard and achieve side control. It's one of the most reliable passes in BJJ because it generates constant pressure while keeping your weight committed. Works well from standing or kneeling." },
          { id: "p3",  name: "Double Under Pass",    description: "Both arms under opponent's legs",           detail: "You scoop both legs under your arms and drive your weight forward onto your opponent's hips, stacking them onto their shoulders. Once stacked, you redirect the legs to one side and pass. The pass is powerful but requires good upper body strength and tight positioning." },
          { id: "p4",  name: "Over-Under Pass",      description: "One arm over, one under the legs",          detail: "A pressure pass where one arm goes over the opponent's near leg and the other threads under their far leg. This creates a crossbody connection that makes it hard for them to hip escape. Combined with shoulder pressure, it's one of the most effective ways to break down a defensive guard." },
          { id: "p5",  name: "Leg Drag Pass",        description: "Dragging legs to the side to pass",         detail: "You pull your opponent's legs across their body while stepping around in the opposite direction. The drag creates rotational misalignment — their hips point one way while you pass the other. It's highly effective against open guards and transitions well into back takes." },
          { id: "p6",  name: "Stack Pass",           description: "Stacking opponent onto shoulders",          detail: "Used against closed guard or triangle attempts, the stack pass drives the opponent's knees to their chest and onto their shoulders, breaking their posture and making it difficult to hold any submission. From there you redirect and pass." },
          { id: "p7",  name: "Smash Pass",           description: "Pressure passing through half guard",       detail: "A high-pressure half guard pass where you flatten your opponent, maintain a crossface, and use your hip and shoulder weight to grind past their leg. The smash pass is more about constant pressure than speed — staying heavy and removing space until the leg pops free." },
          { id: "p8",  name: "Long Step Pass",       description: "Stepping over legs to pass",                detail: "You take a long step over your opponent's legs, using the momentum of the step to clear their guard and land in side control. Timing is critical — it works best when the guard player is recovering or has lost their connection." },
          { id: "p9",  name: "X-Pass",               description: "Redirecting legs across body",              detail: "A quick passing motion where you redirect your opponent's legs to one side and immediately move in the opposite direction. The X shape comes from the cross-directional movement. It's most effective as a counter when the guard player extends their legs." },
          { id: "p10", name: "Headquarters Pass",    description: "Controlling from HQ position",              detail: "HQ (headquarters) is a kneeling passing position where one knee is up and one is down, giving you a strong base to work from. From here you can transition into a knee slice, leg drag, or smash pass depending on how the guard player reacts." },
          { id: "p11", name: "Bullfighter Pass",     description: "Controlling ankles to pass",                detail: "You grip both ankles and use a bull-fighter style push to one side while stepping around the other. The bullfighter is a quick, athletic pass that works well against guard players who try to extend their legs to keep you away." },
          { id: "p12", name: "Cartwheel Pass",       description: "Cartwheeling over guard",                   detail: "An acrobatic pass where you cartwheel over your opponent's legs when they try to extend or invert. It catches guard players off guard and can land you directly in side control or north-south. Requires good body awareness and timing." },
          { id: "p13", name: "Back Step Pass",       description: "Stepping back to clear legs",               detail: "When your opponent tries to recover guard or attack your legs, you step back and disengage, then re-engage from a better angle. The back step is a defensive passing movement often used to counter knee shield or half guard frames." },
          { id: "p14", name: "Folding Pass",         description: "Folding legs to pass closed guard",         detail: "A technique for breaking closed guard by standing, controlling the hips, and folding your opponent's legs to one side to break their lock. Once the guard opens you transition directly into a pass. Requires good posture and hip control to avoid getting swept." }
        ]
      },
      {
        id: "sweeps", name: "Sweeps", icon: "🔄",
        techniques: [
          { id: "sw1",  name: "Scissor Sweep",       description: "Scissoring legs to off-balance",            detail: "A fundamental closed guard sweep. You pull your opponent forward with a collar and sleeve grip, then scissors your legs — one pushing their hip, one sweeping their knee — to topple them to the side. Clean execution requires breaking their posture first." },
          { id: "sw2",  name: "Hip Bump Sweep",      description: "Bridging hips to sweep",                    detail: "From closed guard you sit up explosively into your opponent while bridging your hips, driving their weight over your shoulder. It's a simple, high-percentage sweep that works by surprise. It also sets up the kimura and guillotine if they base their hand out to stop it." },
          { id: "sw3",  name: "Flower Sweep",        description: "Grabbing ankle and sweeping",               detail: "You grab your opponent's ankle with one hand while using your guard to off-balance them to that side. The ankle grip prevents them from posting and combined with the hip rotation creates a clean sweep. Best used when they reach forward or shift their weight." },
          { id: "sw4",  name: "Butterfly Sweep",     description: "Lifting with butterfly hooks",              detail: "From butterfly guard you get an underhook, off-balance your opponent to the hooked side, and drive your hook upward to lift and roll them over. The sweep relies on timing and connection rather than strength — you need to load their weight onto the hook before lifting." },
          { id: "sw5",  name: "Elevator Sweep",      description: "Half guard elevator sweep",                 detail: "A classic half guard sweep. You obtain an underhook and use your trapped leg as an elevator — lifting their leg while rolling into them. The underhook is essential; without it they can flatten you and prevent the roll." },
          { id: "sw6",  name: "Old School Sweep",    description: "Ankle grab from butterfly",                 detail: "From butterfly guard you reach to the outside and grab your opponent's ankle, then use your hook to lift while pulling the ankle. The combination strips their base on that side and rolls them cleanly. A staple of Eddie Bravo's system." },
          { id: "sw7",  name: "X-Guard Sweep",       description: "Standing or tilting from X",                detail: "From X-guard you use your two hooks and grips to tilt your standing opponent off their base. You can sweep them to either side depending on how they react, or stand them up and transition to a single leg. X-guard sweeps reward understanding of your opponent's balance." },
          { id: "sw8",  name: "De La Riva Sweep",    description: "Off-balancing from DLR hook",               detail: "Using your DLR hook and grips you push and pull your opponent's leg to break their posture, then roll them over. The sweep works best when combined with sleeve or ankle control to prevent them from posting. Good DLR requires constant adjustment as they try to pass." },
          { id: "sw9",  name: "Sit-Up Sweep",        description: "Sit-up to single leg sweep",                detail: "From guard you sit up explosively into a single leg, driving through to complete the takedown. The sit-up creates the initial momentum and the level change catches opponents who are pressuring forward. It converts a guard position directly into a wrestling finish." },
          { id: "sw10", name: "Tripod Sweep",        description: "Two ankle, one hip control sweep",          detail: "A standing guard sweep where you control both ankles and place one foot on your opponent's hip. You then push the hip away while pulling one ankle toward you, knocking them backward. Very effective against opponents who stand in your guard without gripping." },
          { id: "sw11", name: "Sickle Sweep",        description: "Hooking ankle from seated",                 detail: "From a seated or butterfly position you hook your opponent's ankle with your leg in a sickle motion and pull it out from under them. Often combined with a push to the opposite shoulder. Works well in combination with the tripod sweep as a reaction counter." },
          { id: "sw12", name: "Lumberjack Sweep",    description: "Pushing and pulling ankles",                detail: "You push one of your opponent's ankles away while pulling the other toward you, creating a rotational imbalance that drops them to the mat. It's a simple mechanic that works when you have foot-on-hip control and they're standing." },
          { id: "sw13", name: "Overhead Sweep",      description: "Rolling opponent overhead",                 detail: "When an opponent drives their weight forward you use their momentum to pull them overhead and roll them past you. It requires timing the momentum rather than fighting it. Commonly used as a counter to stacking or aggressive forward pressure." },
          { id: "sw14", name: "Pendulum Sweep",      description: "Pendulum leg motion sweep",                 detail: "From closed guard you open your guard, swing your leg down to create momentum, then pendulum it back up sharply into your opponent's armpit. Combined with a hip rotation and collar grip this creates a powerful sweep that can roll even heavy opponents." },
          { id: "sw15", name: "Kiss of the Dragon",  description: "Back take or sweep from turtle",            detail: "A technique from the turtle position where you reach through and grab a far ankle, then roll in a specific direction to either sweep your opponent or come up to their back. It requires commitment but is very difficult to stop once the grip and position are established." }
        ]
      },
      {
        id: "takedowns", name: "Takedowns", icon: "⬇️",
        techniques: [
          { id: "td1",  name: "Single Leg Takedown", description: "Shooting on one leg",                       detail: "You shoot in on one of your opponent's legs, controlling it between your arms, then finish by lifting, running the pipe, or tripping. The single leg is versatile and can be entered from a variety of setups including the arm drag, level change, or failed double leg." },
          { id: "td2",  name: "Double Leg Takedown", description: "Shooting on both legs",                     detail: "The most fundamental wrestling takedown. You level change and shoot in on both legs, driving through with your hips to take your opponent to the mat. The double leg requires closing distance quickly and driving through on contact — hesitation kills the shot." },
          { id: "td3",  name: "Ankle Pick",          description: "Grabbing ankle to trip",                    detail: "A subtle takedown where you use a head or collar tie to shift your opponent's weight, then bend down and pick their ankle. Because it requires minimal commitment it's lower risk than a shot. Works well against opponents with a strong sprawl." },
          { id: "td4",  name: "Hip Throw",           description: "Classic judo hip throw",                    detail: "You pull your opponent forward, get your hip in front of them, and use your hip as a fulcrum to throw them over. Ogoshi and O-goshi variations depend on arm placement. Hip throws are powerful when you can get your hips fully below your opponent's centre of gravity." },
          { id: "td5",  name: "Foot Sweep",          description: "Inside leg reap",                           detail: "A judo staple where you time the sweep of your foot against your opponent's ankle or foot as they step, removing their base. Foot sweeps require excellent timing and reading of your opponent's weight distribution — they work on rhythm, not strength." },
          { id: "td6",  name: "Osoto Gari",          description: "Outside major reap",                        detail: "You reap your opponent's outside leg with your own while driving your upper body into them to break their posture backward. Osoto gari is powerful against stiff, upright opponents and can generate significant throwing force. Timing the reap with their weight shift is key." },
          { id: "td7",  name: "Kouchi Gari",         description: "Inside minor reap",                         detail: "A quick inside foot trip where you reap your opponent's foot from the inside as their weight passes over it. Kouchi gari is used as a standalone takedown or as a combination counter when your opponent pulls back from a throw attempt." },
          { id: "td8",  name: "Seoi Nage",           description: "Shoulder throw",                            detail: "You load your opponent onto your back and throw them over your shoulder. The entry requires getting your hips in and your back below their centre of gravity. One of judo's highest-scoring throws, seoi nage requires good kuzushi — breaking their balance before the throw." },
          { id: "td9",  name: "Uchi Mata",           description: "Inner thigh throw",                         detail: "You drive your leg between your opponent's legs and reap the inner thigh while rotating your upper body. Uchi mata is one of the most technical judo throws and can be applied on either leg. It's often used in combination with other throws as a counter-reaction technique." },
          { id: "td10", name: "Snap Down",           description: "Head snap to level change",                 detail: "You snap your opponent's head downward with collar or head pressure, making them react by pushing back up — at which point you shoot in or drag. The snap down is a wrestling staple used to create level changes and disrupt your opponent's posture." },
          { id: "td11", name: "Arm Drag",            description: "Arm drag to back or single",                detail: "You pull your opponent's arm across their body, which rotates their shoulder and exposes their back. From the arm drag you can go directly to the back, shoot a single leg, or set up a trip. It's one of the most efficient entries in grappling because it requires minimal force." },
          { id: "td12", name: "Collar Drag",         description: "Pulling collar to off-balance",             detail: "Using a collar grip you sharply pull your opponent's collar diagonally downward to break their posture and create forward momentum. The collar drag is most common in gi grappling and often sets up throws, trips, or transitions to guard work." },
          { id: "td13", name: "Guard Pull",          description: "Pulling opponent into guard",               detail: "Rather than engaging in a stand-up exchange you drop to guard while maintaining grips. Guard pulling is a strategic choice to get the fight to the ground on your terms. It's common in sport BJJ but requires understanding of how to maintain control during the pull." },
          { id: "td14", name: "Sacrifice Throw",     description: "Falling to execute throw",                  detail: "You intentionally fall to the mat as part of the throwing motion, using your own body weight and momentum to generate throwing force. Sumi gaeshi and tomoe nage are common examples. These throws can be spectacular when they land but carry risk if the throw is blocked." }
        ]
      },
      {
        id: "chokes", name: "Chokes", icon: "🤚",
        techniques: [
          { id: "ch1",  name: "Rear Naked Choke",    description: "Choke from back control",                   detail: "The most fundamental submission from back control. One arm goes under the chin and across the throat, the other arm braces behind the head in a figure-four. When you squeeze, the carotid arteries are compressed and your opponent will go out in seconds if they don't tap. Getting the chin tucked is the primary defence." },
          { id: "ch2",  name: "Guillotine",          description: "Arm around neck from front",                detail: "You wrap your arm around your opponent's neck from the front and apply a choking pressure by lifting with your forearm against the throat. The guillotine can be applied from standing, guard, or sprawl positions. The high elbow guillotine variation is considered the most effective modern finish." },
          { id: "ch3",  name: "Arm-In Guillotine",   description: "Guillotine with arm trapped",               detail: "A variation of the guillotine where one of your opponent's arms is trapped inside your grip along with the neck. While it's harder to finish as a blood choke, the arm-in guillotine applies direct trachea pressure and can force a tap. Danaher's arm-in variation has become prominent in modern grappling." },
          { id: "ch4",  name: "Triangle Choke",      description: "Legs forming triangle around neck",         detail: "Your legs form a triangle around your opponent's neck and one arm, compressing the carotid arteries. The triangle requires getting one shoulder inside and one outside. Proper angle adjustment — turning perpendicular to your opponent — is essential to make the choke tight." },
          { id: "ch5",  name: "Arm Triangle",        description: "Head and arm choke",                        detail: "You trap your opponent's arm against the side of their own head and apply pressure across the carotid artery using your shoulder and the trapped arm as the choking mechanism. The arm triangle is most commonly finished from mount or side control after securing the arm and head." },
          { id: "ch6",  name: "D'Arce Choke",        description: "No-gi arm triangle variation",              detail: "A no-gi arm triangle where your arm threads through the neck-and-arm space rather than going over. You cinch your bicep against the carotid and finish by connecting your hands. The D'arce is particularly common from top half guard or when your opponent is on all fours." },
          { id: "ch7",  name: "Anaconda Choke",      description: "Arm triangle from front headlock",          detail: "Similar to the D'arce but applied from a front headlock position, your arm goes under the neck and through the armpit. You roll your opponent into a mounted version to finish. The anaconda is powerful but requires momentum from a roll to generate the final choking pressure." },
          { id: "ch8",  name: "Bow and Arrow",       description: "Gi collar choke from back",                 detail: "Considered one of the most powerful gi chokes. From back control you grip the collar deep with one hand and control a pant leg with the other, then extend your body like a bow. The extension creates enormous leverage on the collar against the neck." },
          { id: "ch9",  name: "Cross Collar Choke",  description: "Two hand collar choke",                     detail: "From mount or guard you insert both hands deep into your opponent's collar, crossing them at the wrists, then rotate your knuckles into the carotid arteries on both sides. A deep grip makes this choke very hard to defend. One of the most classic gi submissions." },
          { id: "ch10", name: "Baseball Bat Choke",  description: "Gi choke with grip variation",              detail: "A collar choke where you grip with both hands on the same side of the collar in an offset baseball bat grip, then apply rotational pressure against the neck. Often set up from turtle or side control when your opponent is defending. The rotation of the wrists into the arteries makes it highly effective." },
          { id: "ch11", name: "Loop Choke",          description: "Gi collar loop choke",                      detail: "You feed your opponent's own collar around their neck in a loop and apply pressure. Loop chokes can be applied quickly when your opponent has their head down and are often caught as a counter to aggressive guard passing. The element of surprise is a big part of their effectiveness." },
          { id: "ch12", name: "Clock Choke",         description: "Gi choke from turtle position",             detail: "Applied against a turtled opponent. You take a deep collar grip and walk in a clock motion around their head while driving your shoulder into the back of their neck. The combination of the collar grip and your body weight creates the choking pressure." },
          { id: "ch13", name: "North-South Choke",   description: "Choke from north-south position",           detail: "From north-south you slip your arm under your opponent's neck and lock your hands together, then use a hip drop to cinch the choke. It's a blood choke that comes on quickly with little warning. Getting the arm deep enough under the neck is the main technical challenge." },
          { id: "ch14", name: "Ezekiel Choke",       description: "Sleeve choke from mount",                   detail: "A gi choke from mount where you insert one hand into your own sleeve and use the forearm-and-sleeve grip to apply pressure across the neck. It can be applied even when your opponent is defending actively with their hands, making it an excellent mounted attack." },
          { id: "ch15", name: "Brabo Choke",         description: "Lapel-based choke",                         detail: "You feed your opponent's own lapel under their arm and around their neck to create a choking loop. Brabo chokes are applied from top positions and combine the control of an arm triangle with the tightness of a lapel wrap. They're difficult to see coming and hard to escape once set." },
          { id: "ch16", name: "Von Flue Choke",      description: "Counter to guillotine",                     detail: "A counter to the guillotine — when your opponent attempts to finish the guillotine you post your hand on their far shoulder, drive your shoulder into their neck, and lock your hands. Your shoulder compresses the carotid artery from the outside. It punishes over-committed guillotine attempts." }
        ]
      },
      {
        id: "joint_locks", name: "Joint Locks", icon: "💪",
        techniques: [
          { id: "jl1",  name: "Armbar",              description: "Hyperextending the elbow",                  detail: "The armbar is one of BJJ's most fundamental submissions. You isolate your opponent's arm across your hips and apply downward pressure against the elbow joint, hyperextending it. It can be applied from guard, mount, back control, and many transitions. Keeping your knees pinched together and hips close to the shoulder are the keys to a tight finish." },
          { id: "jl2",  name: "Kimura",              description: "Figure-four shoulder lock",                 detail: "A figure-four grip on the wrist rotates the shoulder internally beyond its range of motion. The kimura is applied from side control, guard, or north-south. Beyond being a submission it doubles as a control and transition tool — the kimura grip can be used to take the back, sweep, or maintain position." },
          { id: "jl3",  name: "Americana",           description: "Figure-four the other direction",           detail: "The americana externally rotates the shoulder joint. From mount or side control you pin the wrist to the mat and lift the elbow, creating the lock. It's one of the first submissions taught in BJJ because it requires minimal flexibility or athleticism — positional control does the work." },
          { id: "jl4",  name: "Omoplata",            description: "Shoulder lock with legs",                   detail: "From guard you swing your leg over your opponent's arm and use your body weight to rotate their shoulder internally. The omoplata functions as both a submission and a sweep, and is a common byproduct of failed triangle and armbar attempts. Preventing the roll is key to finishing." },
          { id: "jl5",  name: "Wrist Lock",          description: "Applying pressure to the wrist",            detail: "Wrist locks apply force against the small joints of the wrist, bending it beyond its normal range. They can be applied from almost any position and come on very quickly. In BJJ they're often caught as opportunistic submissions when an opponent posts or grips in a vulnerable way." },
          { id: "jl6",  name: "Gogoplata",           description: "Shin across throat from guard",             detail: "An unconventional submission where you pull your opponent's head down and slide your shin across their throat from rubber guard or inverted guard. The shin compresses the trachea and requires significant flexibility to position correctly. It's rarely seen at high levels but catches opponents by surprise." },
          { id: "jl7",  name: "Tarikoplata",         description: "Shoulder lock variation",                   detail: "A shoulder lock applied when you have a kimura grip but your opponent defends by grabbing their own belt or shorts. You transition to the tarikoplata by rotating your body to create a different angle of shoulder pressure. Named after Tarik Hopstock who popularised it." },
          { id: "jl8",  name: "Baratoplata",         description: "Shoulder lock from bottom",                 detail: "Applied from bottom positions, the baratoplata is a shoulder lock that uses your legs and arms together to isolate and rotate your opponent's shoulder. It's associated with Paulo Miyao and attacks opponents who are stacking or attempting to pass." },
          { id: "jl9",  name: "Monoplata",           description: "Single arm shoulder lock",                  detail: "A shoulder lock where you control a single arm and use your body positioning to apply rotational pressure to the shoulder joint. Less common than the kimura or omoplata, the monoplata appears from guard and transition positions when a specific arm angle presents itself." },
          { id: "jl10", name: "Arm Crush",           description: "Crushing the arm with legs",                detail: "You trap your opponent's arm between your legs and apply compressive force against the bicep or forearm. Often used as a finishing mechanism when a standard armbar grip is unavailable. The crushing pressure can be enough to force a tap even without full hyperextension." }
        ]
      },
      {
        id: "leg_locks", name: "Leg Locks", icon: "🦵",
        techniques: [
          { id: "ll1",  name: "Straight Ankle Lock", description: "Basic ankle compression",                   detail: "The most fundamental leg lock. You trap the foot in your armpit and arch back, driving your forearm into the achilles tendon. The straight ankle lock is the first leg lock taught in most gyms and is legal at all competition levels. It attacks the ankle joint and achilles tendon simultaneously." },
          { id: "ll2",  name: "Heel Hook",           description: "Rotating the heel to attack knee",          detail: "You trap the foot and rotate the heel, which torques the knee joint in a direction it cannot withstand. Heel hooks are among the most powerful and dangerous submissions in grappling — the damage can occur before pain is felt. Proper leg entanglement and control of the hip and foot are required to finish safely." },
          { id: "ll3",  name: "Inside Heel Hook",    description: "Heel hook from inside position",            detail: "Applied from an inside leg entanglement, you hook the heel and rotate inward, attacking the medial structures of the knee. The inside heel hook is one of the highest percentage leg lock finishes in modern competition grappling and is the primary finish from the saddle position." },
          { id: "ll4",  name: "Outside Heel Hook",   description: "Heel hook from outside position",           detail: "Applied from an outside entanglement, you hook the heel and rotate outward, targeting the lateral knee structures. The outside heel hook is associated with the 50/50 guard and outside ashi garami. It's considered slightly more dangerous than the inside version due to the knee structures attacked." },
          { id: "ll5",  name: "Knee Bar",            description: "Hyperextending the knee",                   detail: "You trap the opponent's leg across your hips in the same way you'd set up an armbar, but targeting the knee joint. The pressure hyperextends the knee. Knee bars can be entered from top passing positions, guard, and leg lock exchanges. Proper hip positioning drives the finishing pressure." },
          { id: "ll6",  name: "Toe Hold",            description: "Figure-four on the foot",                   detail: "A figure-four grip on the foot allows you to rotate the ankle and apply torsional force to the knee. The toe hold is versatile — it can be applied from top or bottom and entered from many leg entanglements. It's particularly common as a counter when opponents are defending heel hooks." },
          { id: "ll7",  name: "Calf Slicer",         description: "Compression of the calf",                   detail: "You wedge your forearm or shin into the back of your opponent's knee and compress it, creating intense pressure in the calf muscle. Calf slicers are more of a pain compliance technique than a structural attack, but they're highly effective and can be applied quickly from top positions." },
          { id: "ll8",  name: "Banana Split",        description: "Splitting legs apart",                       detail: "You trap one leg high and one leg low, then split them apart to create a painful groin stretch. The banana split is often caught from top turtle or scramble positions. Flexible opponents can resist it, but for most the pressure is immediate and severe." },
          { id: "ll9",  name: "50/50 Heel Hook",     description: "Heel hook from 50/50 guard",                detail: "From the 50/50 position both athletes have equal leg entanglement on each other. The outside heel hook is the primary finish. 50/50 exchanges require understanding of the position's parity — both players have the same attack, so timing and gripping first is decisive." },
          { id: "ll10", name: "Saddle / Honey Hole", description: "Inside heel hook entry position",           detail: "Also called the inside sankaku or honey hole, the saddle is a leg entanglement where your legs control both of your opponent's legs from the inside. It's the strongest position for the inside heel hook and is very difficult to exit safely. Control of the hip and the figure-four on the heel is the standard finish." },
          { id: "ll11", name: "Ashi Garami",         description: "Basic leg entanglement",                    detail: "The foundational leg entanglement in modern leg lock systems. One leg hooks inside the hip while the other controls outside the knee, creating a frame around the leg. Ashi garami is the starting point for most heel hook and ankle lock attacks and is the position John Danaher's system is built around." }
        ]
      },
      {
        id: "escapes", name: "Escapes", icon: "🚪",
        techniques: [
          { id: "e1",  name: "Bridge and Roll",      description: "Escaping mount with bridge",                detail: "One of the first escapes taught. You trap your opponent's arm and same-side foot, then bridge explosively to one side to roll them off. The trap is essential — without it they simply post and base out. The bridge needs to be fast and powerful to generate the momentum to roll a heavy opponent." },
          { id: "e2",  name: "Elbow-Knee Escape",    description: "Recovering guard from mount",               detail: "The most reliable way to recover guard from under mount. You create a frame with your elbow and knee on the same side, shrimp away to create space, then bring your knee through to re-establish half or full guard. Frames stop them from flattening you while you create the hip space to move." },
          { id: "e3",  name: "Trap and Roll",        description: "Trapping arm and leg to escape",            detail: "From mount you trap your opponent's arm and the same-side ankle, then bridge to roll them over. The double trap takes away both of their posting options on that side. It requires setting up the arm trap naturally — grabbing the arm directly often alerts them to the escape." },
          { id: "e4",  name: "Guard Recovery",       description: "Re-establishing guard",                     detail: "A general term for the movement and framing skills used to get back to guard from bad positions. It involves hip escapes, frames, and re-routing your legs back into a guard configuration. Good guard recovery is what separates defensive grapplers from those who constantly get submitted from bad positions." },
          { id: "e5",  name: "Shrimp Escape",        description: "Hip escape to recover guard",               detail: "Shrimping is the fundamental BJJ movement for creating space on the ground. You push off one foot and drive your hip away while framing, creating just enough space to insert your knee and recover guard. Shrimping can be used in multiple directions depending on your opponent's weight distribution." },
          { id: "e6",  name: "Technical Stand-Up",   description: "Standing up safely from bottom",            detail: "When your opponent is in your guard or you're seated, the technical stand-up allows you to rise to your feet without exposing your back or getting taken back down. One hand posts on the mat, one frames on the opponent, and you sweep your leg through to stand. It's a core movement in wrestling and MMA." },
          { id: "e7",  name: "Turtle Escape",        description: "Escaping from turtle position",             detail: "The turtle position is a common defensive position but leaves you vulnerable to the back take and various chokes. Escapes include rolling away, granby rolling, and sitting out. The key is not staying static — a turtled opponent who doesn't move will inevitably be broken down or choked." },
          { id: "e8",  name: "Back Escape",          description: "Escaping rear mount",                       detail: "Escaping the back requires managing your opponent's hooks and the seatbelt grip. The primary escape involves turning into your opponent by removing the bottom hook and rotating to face them, ending in their guard rather than giving up a submission. Protecting the neck throughout is essential." },
          { id: "e9",  name: "Side Control Escape",  description: "Recovering from side control",              detail: "Side control escapes rely on frames to prevent chest-to-chest pressure and hip escapes to create space. Common escapes include the underhook return to guard, the bridge to knees, and the elbow push to re-guard. The worst thing to do is go flat — staying on your side maintains the ability to move." },
          { id: "e10", name: "North-South Escape",   description: "Escaping north-south position",             detail: "From north-south you're vulnerable to chokes and kimuras. Escapes involve rotating your body to get back to a side-on position, often by bridging and turning into your opponent. Creating any kind of frame between you and their hips is the first priority." },
          { id: "e11", name: "Knee on Belly Escape", description: "Escaping knee on belly",                    detail: "The discomfort of knee on belly is intentional — it's designed to make you move. The escape involves pushing the knee off your belly as you bridge away, recovering to guard or creating space to stand. Moving toward your opponent rather than away is often more effective." },
          { id: "e12", name: "Leg Lock Escape",      description: "Defending and escaping leg locks",          detail: "Leg lock defence starts with prevention — understanding which entanglements are dangerous and not entering them carelessly. When caught, the heel hook escape involves controlling the heel and rotating out before the finish is applied. Early recognition is everything; the window to escape closes fast under good leg lock pressure." }
        ]
      },
      {
        id: "positions", name: "Positional Control", icon: "📍",
        techniques: [
          { id: "pos1",  name: "Mount",              description: "Sitting on opponent's torso",               detail: "Mount is one of the highest positions in BJJ. You sit across your opponent's torso with your knees on the mat, limiting their ability to move or escape. From here you can threaten armbars, chokes, and transitions to back control. Staying low and heavy while maintaining balance against their escapes is the key skill." },
          { id: "pos2",  name: "High Mount",         description: "Mount high on chest/armpits",               detail: "You advance your mount to sit high on the chest near the armpits. This neutralises your opponent's elbow-knee escape and opens up collar chokes, arm attacks, and neck cranks. High mount requires good balance as your opponent will bridge harder to unseat you from this position." },
          { id: "pos3",  name: "Side Control",       description: "Chest to chest beside opponent",            detail: "You lie chest-to-chest perpendicular to your opponent with their arm trapped. Side control is a stable dominant position with many submission options including kimuras, americanas, and arm triangles. The crossface and underhook are your primary tools for maintaining control and preventing escapes." },
          { id: "pos4",  name: "Knee on Belly",      description: "Knee pressing on opponent's stomach",       detail: "A transitional dominant position where your knee drives into your opponent's stomach while you keep your other leg posted for balance. It creates intense discomfort and forces a reaction, which you use to transition to mount, take the back, or catch a submission. Maintaining balance against their push is the main challenge." },
          { id: "pos5",  name: "Back Control",       description: "Behind opponent with hooks in",             detail: "Back control is the highest position in BJJ — your opponent cannot see or control your hands effectively. You maintain control with a seatbelt grip and two hooks inside the hips. From here the rear naked choke, bow and arrow, and various other attacks are available. Keeping your hooks in and your chin tucked from their counter attempts are key." },
          { id: "pos6",  name: "Rear Mount",         description: "Back control with hooks",                   detail: "Effectively the same as back control, rear mount specifically refers to the position with both hooks inside your opponent's thighs while seated behind them. It's the ideal finishing position for the rear naked choke and is the primary goal when pursuing back takes throughout a match." },
          { id: "pos7",  name: "North-South",        description: "Head to feet chest pressure",               detail: "You are chest-to-chest with your opponent but facing their feet. North-south is often a transitional position used between side control and other attacks, but it's also where the north-south choke and kimura are applied. Keeping your hips heavy and low prevents them from getting their knees back in." },
          { id: "pos8",  name: "Turtle Control",     description: "Controlling opponent in turtle",            detail: "When your opponent turtles you can take their back, attack with chokes like the clock choke, or break them down with hooks and body lock control. Maintaining a tight connection prevents them from rolling to safety. The key is reacting to their movement direction to cut off escapes." },
          { id: "pos9",  name: "Body Lock",          description: "Arms around opponent's waist",              detail: "A clinch control where your arms wrap around your opponent's waist from behind. The body lock is used for takedowns, to prevent escapes from turtle, and to control positioning in scrambles. It limits your opponent's hip movement dramatically and is the foundation of body lock pass and takedown sequences." },
          { id: "pos10", name: "Crucifix",           description: "Both arms controlled from back",            detail: "From the back or turtle you control both of your opponent's arms using your own arms and legs, leaving their neck completely undefended. It's a rare but dominant position that makes chokes trivial to apply. Getting both arms controlled simultaneously requires significant technical precision." },
          { id: "pos11", name: "50/50 Guard",        description: "Mutual leg entanglement",                   detail: "A position where both athletes have equal leg entanglement on each other. It's associated with stalling at lower levels but at high levels is an active attacking platform for outside heel hooks and leg lock exchanges. Understanding who is in a better finishing position before committing is what separates good 50/50 players." }
        ]
      },
      {
        id: "transitions", name: "Transitions", icon: "🔀",
        techniques: [
          { id: "tr1",  name: "Back Take from Turtle",   description: "Taking back from turtle position",      detail: "When your opponent turtles you insert a seatbelt grip and work to get both hooks in. Common entries include the body lock roll, the seat belt with a single hook in that forces a turn, and the clock choke setup that becomes a back take. Speed of the seatbelt before they react determines success." },
          { id: "tr2",  name: "Back Take from Guard",    description: "Taking back via omoplata or sweep",     detail: "Several guard attacks transition naturally to back takes. Failed omoplata finishes, DLR sweeps, and sit-up guard single legs all commonly end with you behind your opponent. Recognising these transitions and having the connection ready to secure the seatbelt makes your guard attacks far more dangerous even when they're defended." },
          { id: "tr3",  name: "Mount to Back Take",      description: "Transitioning to back control",         detail: "When your opponent successfully bridges to escape mount, following them as they roll and inserting the seatbelt keeps you dominant rather than ending up in their guard. The key is not resisting the roll but going with it and arriving on the back rather than fighting to stay mounted." },
          { id: "tr4",  name: "Guard to Mount",          description: "Sweeping to mount position",            detail: "A sweep that lands you in mount rather than guard creates an immediate dominant position. Scissor sweeps, hip bump sweeps, and butterfly sweeps all potentially land in full mount if you follow your opponent through the rotation tightly. Maintaining connection through the sweep is what determines where you land." },
          { id: "tr5",  name: "Side Control to Mount",   description: "Advancing to mount",                    detail: "From side control you advance to mount by either walking your knees up toward their armpit or by using a knee tap to step over. The key is controlling their near arm to prevent them from framing and creating space. The transition should be smooth and connected — pausing gives them time to bridge or elbow-knee escape." },
          { id: "tr6",  name: "Triangle to Armbar",      description: "Switching between submissions",         detail: "When an opponent defends the triangle by stacking or clasping their hands you switch to the armbar on the trapped arm. The triangle sets up the angle; you simply adjust your hips and extend. This combination is one of the most fundamental attack chains in BJJ because defending one opens the other." },
          { id: "tr7",  name: "Kimura to Back Take",     description: "Using kimura to take back",             detail: "When an opponent defends the kimura finish by grabbing their belt or pants, you use the grip itself to roll them forward and take their back. The kimura grip maintains control throughout the transition. This is a common pattern from north-south and half guard top positions." },
          { id: "tr8",  name: "Omoplata to Sweep",       description: "Finishing or sweeping from omoplata",   detail: "When your opponent rolls out of the omoplata finish you follow them into the roll and end up in a top position — often mount or side control. Rather than releasing the submission to prevent the roll, following it converts a defended submission into a positional gain." },
          { id: "tr9",  name: "Single Leg to Double",    description: "Changing leg attack",                   detail: "When a single leg is defended by your opponent sprawling or framing against your head, you can change levels and shoot through to a double leg. The transition requires re-shooting but uses the single leg as a distraction and level change to make the double easier to secure." },
          { id: "tr10", name: "Leg Lock to Back Take",   description: "Transitioning from leg entanglement",   detail: "When a heel hook is defended or your opponent tries to escape, the rotation they create often presents their back. Following their escape direction rather than holding the leg lock frequently gives you the back. This mindset — of seeing leg lock defences as back take opportunities — is fundamental to modern leg lock systems." },
          { id: "tr11", name: "DLR to Back Take",        description: "Back take from De La Riva",             detail: "The DLR hook controls your opponent's lead leg, and when they try to clear the hook or step around it you rotate your hips and follow to their back. The berimbolo is the most famous version but simpler back takes from DLR are possible when your opponent gives the rotation without defending the back." },
          { id: "tr12", name: "Berimbolo",               description: "Inverted back take sequence",           detail: "A sequence from inverted guard or DLR where you invert under your opponent and use their rotation to take their back. The berimbolo requires comfort inverting and precise hip control. Popularised by the Miyao brothers, it's one of the most distinctive techniques in modern sport BJJ and can be chained repeatedly in scrambles." }
        ]
      },
      {
        id: "drilling", name: "Drilling & Fundamentals", icon: "🔁",
        techniques: [
          { id: "dr1",  name: "Shrimping",           description: "Hip escape movement drill",                 detail: "Shrimping is the single most important movement drill in BJJ. You push off one foot and drive your hip sideways while framing, mimicking the motion used to escape every bottom position. Drilling shrimping builds the muscle memory that makes guard recovery and bottom escapes feel natural under pressure." },
          { id: "dr2",  name: "Bridging",            description: "Hip bridge movement drill",                 detail: "The bridge drives your hips explosively upward off the mat and is the foundation of the bridge-and-roll escape, the hip bump sweep, and guard recovery. Drilling it builds hip explosiveness and teaches you to generate force from the mat when you're on your back." },
          { id: "dr3",  name: "Forward Roll",        description: "Basic forward rolling",                     detail: "A basic gymnastics movement that builds comfort with inversion and rolling through unfamiliar body positions. In BJJ context, forward rolls develop the spatial awareness and commitment needed for techniques like the somersault entry, the berimbolo, and break falls when thrown." },
          { id: "dr4",  name: "Backward Roll",       description: "Basic backward rolling",                    detail: "The backward roll builds comfort moving in reverse and develops the neck strength and spatial awareness needed for inverted guard and back-rolling sweeps. It's also a foundation for safe break-falling when taken down backward." },
          { id: "dr5",  name: "Hip Switch",          description: "Switching hips drill",                      detail: "A drill where you switch your hips from one side to the other while maintaining a guard or bottom position. The hip switch is fundamental to keeping your guard active, preventing passes, and connecting guard retention to sweeps. It mirrors the constant hip repositioning required in live rolling." },
          { id: "dr6",  name: "Technical Stand-Up Drill", description: "Repeating the stand-up movement",     detail: "Repeated practice of the technical stand-up movement — posting one hand, framing with the other, sweeping the leg through. Drilling it builds the automatic response to stand safely when the opportunity arises, which is a critical skill in both sport BJJ and self-defence situations." },
          { id: "dr7",  name: "Pummelling",          description: "Underhook fighting drill",                  detail: "Two partners fight for the underhook in a fluid pummel drill, each trying to establish inside control of the other's body. Pummelling builds sensitivity to clinch positions, develops the habit of fighting for the underhook reflexively, and is a foundational wrestling and grappling drill." },
          { id: "dr8",  name: "Grip Fighting",       description: "Controlling and breaking grips",            detail: "A drill focused on establishing your preferred grips while breaking your opponent's. Grip fighting determines the entire dynamic of a gi match — whoever controls the grips largely controls the engagement. Regular grip fighting drills build the reflexes and strength to dominate grip exchanges." },
          { id: "dr9",  name: "Flow Rolling",        description: "Light technical sparring",                  detail: "A style of sparring where both partners roll at low intensity and allow techniques to work without full resistance. Flow rolling is used to practice transitions, test new techniques, and build movement vocabulary without the physical toll of hard sparring. It requires mutual cooperation and an ego-free mindset." },
          { id: "dr10", name: "Positional Sparring", description: "Sparring from specific positions",          detail: "You and your partner start from a defined position — mount escape, back defence, leg lock entanglement — and spar from there. Positional sparring builds specific skills much faster than regular rolling because you get dozens of reps from the same position in a short time rather than waiting for it to arise organically." }
        ]
      }
    ]
  };

  let drilledList    = [];
  let appliedList    = [];
  let activeSection  = null; // 'drilled' | 'applied'

  // ─── Open picker ──────────────────────────────────
  function openPicker(section) {
    activeSection = section;

    const panel    = document.getElementById('tech-picker-panel');
    const backdrop = document.getElementById('tech-picker-backdrop');
    const title    = document.getElementById('tech-picker-title');

    if (!panel) return;

    // Set title
    if (title) {
      title.textContent = section === 'drilled' ? 'Drills' : 'Applied in Sparring';
    }

    // Build list
    buildPickerList(section);

    // Remove hidden, then animate in
    panel.classList.remove('hidden');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.classList.add('visible');
        if (backdrop) backdrop.classList.add('visible');
      });
    });
  }

  // ─── Close picker ─────────────────────────────────
  function closePicker() {
    const panel    = document.getElementById('tech-picker-panel');
    const backdrop = document.getElementById('tech-picker-backdrop');

    if (panel) {
      panel.classList.remove('visible');
      if (backdrop) backdrop.classList.remove('visible');
      setTimeout(() => {
        panel.classList.add('hidden');
      }, 380);
    }

    activeSection = null;
  }

  // ─── Build picker list ────────────────────────────
  function buildPickerList(section) {
    const listEl = document.getElementById('tech-picker-list');
    if (!listEl) return;

    const currentList = section === 'drilled' ? drilledList : appliedList;
    const isApplied   = section === 'applied';

    listEl.innerHTML = '';

    TECHNIQUES_DATA.categories.forEach(cat => {
      // Category heading
      const heading = document.createElement('div');
      heading.className = 'tech-picker-category';
      heading.textContent = `${cat.icon} ${cat.name}`;
      listEl.appendChild(heading);

      // Technique rows
      cat.techniques.forEach(tech => {
        const isSelected = currentList.some(t => t.id === tech.id);
        const row = document.createElement('div');
        row.className = `tech-picker-row${isSelected ? (isApplied ? ' selected--applied' : ' selected') : ''}`;
        row.dataset.id = tech.id;
        row.innerHTML = `
          <div>
            <div class="tech-picker-row-name">${tech.name}</div>
            <div class="tech-picker-row-desc">${tech.description}</div>
          </div>
          <div class="tech-picker-check">
            <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5l3.5 3.5L11 1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        `;
        row.addEventListener('click', () => toggleTechnique(tech, row, section));
        listEl.appendChild(row);
      });
    });
  }

  // ─── Toggle technique ─────────────────────────────
  function toggleTechnique(tech, rowEl, section) {
    const list     = section === 'drilled' ? drilledList : appliedList;
    const isApplied = section === 'applied';
    const idx      = list.findIndex(t => t.id === tech.id);

    if (idx > -1) {
      list.splice(idx, 1);
      rowEl.classList.remove('selected', 'selected--applied');
    } else {
      list.push(tech);
      rowEl.classList.add(isApplied ? 'selected--applied' : 'selected');
    }

    renderTiles(section);
    LogPages.setDirty(true);
  }

  // ─── Render tiles ────────────────────────────────
  function renderTiles(section) {
    const list    = section === 'drilled' ? drilledList : appliedList;
    const tilesEl = document.getElementById(`${section}-tiles`);
    if (!tilesEl) return;

    tilesEl.innerHTML = '';
    list.forEach(tech => {
      const tile = document.createElement('div');
      tile.className = 'tech-tile' + (section === 'applied' ? ' tech-tile--applied' : '');
      tile.innerHTML = `
        <span>${tech.name}</span>
        <button class="tech-tile-remove" aria-label="Remove ${tech.name}">×</button>
      `;
      tile.querySelector('.tech-tile-remove').addEventListener('click', () => {
        removeTechnique(section, tech.id);
      });
      tilesEl.appendChild(tile);
    });
  }

  // ─── Remove technique ────────────────────────────
  function removeTechnique(section, techId) {
    if (section === 'drilled') {
      drilledList = drilledList.filter(t => t.id !== techId);
    } else {
      appliedList = appliedList.filter(t => t.id !== techId);
    }
    renderTiles(section);
  }

  // ─── Render page ─────────────────────────────────
  function renderPage() {
    renderTiles('drilled');
    renderTiles('applied');
  }

  // ─── Init ────────────────────────────────────────
  function init() {
    const drilledBtn = document.getElementById('drilled-add-btn');
    const appliedBtn = document.getElementById('applied-add-btn');
    if (drilledBtn) drilledBtn.addEventListener('click', () => openPicker('drilled'));
    if (appliedBtn) appliedBtn.addEventListener('click', () => openPicker('applied'));

    const doneBtn = document.getElementById('tech-picker-done');
    if (doneBtn) doneBtn.addEventListener('click', closePicker);

    const backdrop = document.getElementById('tech-picker-backdrop');
    if (backdrop) backdrop.addEventListener('click', closePicker);

    // Drag to dismiss — only on handle area, not the list
    const panel      = document.getElementById('tech-picker-panel');
    const handleArea = document.getElementById('tech-picker-handle-area');
    if (panel && handleArea) {
      let startY    = 0;
      let startTime = 0;

      handleArea.addEventListener('touchstart', e => {
        startY    = e.touches[0].clientY;
        startTime = Date.now();
      }, { passive: true });

      handleArea.addEventListener('touchmove', e => {
        const delta = e.touches[0].clientY - startY;
        if (delta > 0) {
          panel.style.transition = 'none';
          panel.style.transform  = `translateY(${delta}px)`;
        }
      }, { passive: true });

      handleArea.addEventListener('touchend', e => {
        const delta    = e.changedTouches[0].clientY - startY;
        const velocity = delta / (Date.now() - startTime);
        panel.style.transition = '';
        panel.style.transform  = '';
        if (delta > 100 || velocity > 0.4) closePicker();
      });
    }
  }

  // ─── Reset ───────────────────────────────────────
  function reset() {
    drilledList   = [];
    appliedList   = [];
    activeSection = null;
    closePicker();
    renderTiles('drilled');
    renderTiles('applied');
  }

  function getDrilled() { return [...drilledList]; }
  function getApplied() { return [...appliedList]; }

  return { init, renderPage, reset, getDrilled, getApplied, TECHNIQUES_DATA };

})();