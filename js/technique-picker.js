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
          { id: "g1",  name: "Closed Guard",        description: "Legs locked around opponent's waist" },
          { id: "g2",  name: "Half Guard",           description: "One leg trapped between yours" },
          { id: "g3",  name: "Deep Half Guard",      description: "Underhooking the leg from half guard" },
          { id: "g4",  name: "Butterfly Guard",      description: "Feet hooked inside opponent's thighs" },
          { id: "g5",  name: "X-Guard",              description: "Two-point control under opponent" },
          { id: "g6",  name: "Single Leg X",         description: "One leg controlled with body under" },
          { id: "g7",  name: "Spider Guard",         description: "Sleeve grips with feet on biceps" },
          { id: "g8",  name: "Lasso Guard",          description: "Leg wrapped around opponent's arm" },
          { id: "g9",  name: "De La Riva Guard",     description: "Outside hook on lead leg" },
          { id: "g10", name: "Reverse De La Riva",   description: "Inside hook on lead leg" },
          { id: "g11", name: "Worm Guard",           description: "Lapel threaded through De La Riva" },
          { id: "g12", name: "Inverted Guard",       description: "Upside down guard position" },
          { id: "g13", name: "Rubber Guard",         description: "High closed guard with leg control" },
          { id: "g14", name: "93 Guard",             description: "Shin across opponent's hip" },
          { id: "g15", name: "Sit-Up Guard",         description: "Seated guard with underhook" },
          { id: "g16", name: "Squid Guard",          description: "Lapel-based guard control" }
        ]
      },
      {
        id: "passes", name: "Guard Passes", icon: "➡️",
        techniques: [
          { id: "p1",  name: "Torreando Pass",       description: "Pushing legs aside to pass" },
          { id: "p2",  name: "Knee Slice Pass",      description: "Knee cutting through half guard" },
          { id: "p3",  name: "Double Under Pass",    description: "Both arms under opponent's legs" },
          { id: "p4",  name: "Over-Under Pass",      description: "One arm over, one under the legs" },
          { id: "p5",  name: "Leg Drag Pass",        description: "Dragging legs to the side to pass" },
          { id: "p6",  name: "Stack Pass",           description: "Stacking opponent onto shoulders" },
          { id: "p7",  name: "Smash Pass",           description: "Pressure passing through half guard" },
          { id: "p8",  name: "Long Step Pass",       description: "Stepping over legs to pass" },
          { id: "p9",  name: "X-Pass",               description: "Redirecting legs across body" },
          { id: "p10", name: "Headquarters Pass",    description: "Controlling from HQ position" },
          { id: "p11", name: "Bullfighter Pass",     description: "Controlling ankles to pass" },
          { id: "p12", name: "Cartwheel Pass",       description: "Cartwheeling over guard" },
          { id: "p13", name: "Back Step Pass",       description: "Stepping back to clear legs" },
          { id: "p14", name: "Folding Pass",         description: "Folding legs to pass closed guard" }
        ]
      },
      {
        id: "sweeps", name: "Sweeps", icon: "🔄",
        techniques: [
          { id: "sw1",  name: "Scissor Sweep",       description: "Scissoring legs to off-balance" },
          { id: "sw2",  name: "Hip Bump Sweep",      description: "Bridging hips to sweep" },
          { id: "sw3",  name: "Flower Sweep",        description: "Grabbing ankle and sweeping" },
          { id: "sw4",  name: "Butterfly Sweep",     description: "Lifting with butterfly hooks" },
          { id: "sw5",  name: "Elevator Sweep",      description: "Half guard elevator sweep" },
          { id: "sw6",  name: "Old School Sweep",    description: "Ankle grab from butterfly" },
          { id: "sw7",  name: "X-Guard Sweep",       description: "Standing or tilting from X" },
          { id: "sw8",  name: "De La Riva Sweep",    description: "Off-balancing from DLR hook" },
          { id: "sw9",  name: "Sit-Up Sweep",        description: "Sit-up to single leg sweep" },
          { id: "sw10", name: "Tripod Sweep",        description: "Two ankle, one hip control sweep" },
          { id: "sw11", name: "Sickle Sweep",        description: "Hooking ankle from seated" },
          { id: "sw12", name: "Lumberjack Sweep",    description: "Pushing and pulling ankles" },
          { id: "sw13", name: "Overhead Sweep",      description: "Rolling opponent overhead" },
          { id: "sw14", name: "Pendulum Sweep",      description: "Pendulum leg motion sweep" },
          { id: "sw15", name: "Kiss of the Dragon",  description: "Back take or sweep from turtle" }
        ]
      },
      {
        id: "takedowns", name: "Takedowns", icon: "⬇️",
        techniques: [
          { id: "td1",  name: "Single Leg Takedown", description: "Shooting on one leg" },
          { id: "td2",  name: "Double Leg Takedown", description: "Shooting on both legs" },
          { id: "td3",  name: "Ankle Pick",          description: "Grabbing ankle to trip" },
          { id: "td4",  name: "Hip Throw",           description: "Classic judo hip throw" },
          { id: "td5",  name: "Foot Sweep",          description: "Inside leg reap" },
          { id: "td6",  name: "Osoto Gari",          description: "Outside major reap" },
          { id: "td7",  name: "Kouchi Gari",         description: "Inside minor reap" },
          { id: "td8",  name: "Seoi Nage",           description: "Shoulder throw" },
          { id: "td9",  name: "Uchi Mata",           description: "Inner thigh throw" },
          { id: "td10", name: "Snap Down",           description: "Head snap to level change" },
          { id: "td11", name: "Arm Drag",            description: "Arm drag to back or single" },
          { id: "td12", name: "Collar Drag",         description: "Pulling collar to off-balance" },
          { id: "td13", name: "Guard Pull",          description: "Pulling opponent into guard" },
          { id: "td14", name: "Sacrifice Throw",     description: "Falling to execute throw" }
        ]
      },
      {
        id: "chokes", name: "Chokes", icon: "🤚",
        techniques: [
          { id: "ch1",  name: "Rear Naked Choke",    description: "Choke from back control" },
          { id: "ch2",  name: "Guillotine",          description: "Arm around neck from front" },
          { id: "ch3",  name: "Arm-In Guillotine",   description: "Guillotine with arm trapped" },
          { id: "ch4",  name: "Triangle Choke",      description: "Legs forming triangle around neck" },
          { id: "ch5",  name: "Arm Triangle",        description: "Head and arm choke" },
          { id: "ch6",  name: "D'Arce Choke",        description: "No-gi arm triangle variation" },
          { id: "ch7",  name: "Anaconda Choke",      description: "Arm triangle from front headlock" },
          { id: "ch8",  name: "Bow and Arrow",       description: "Gi collar choke from back" },
          { id: "ch9",  name: "Cross Collar Choke",  description: "Two hand collar choke" },
          { id: "ch10", name: "Baseball Bat Choke",  description: "Gi choke with grip variation" },
          { id: "ch11", name: "Loop Choke",          description: "Gi collar loop choke" },
          { id: "ch12", name: "Clock Choke",         description: "Gi choke from turtle position" },
          { id: "ch13", name: "North-South Choke",   description: "Choke from north-south position" },
          { id: "ch14", name: "Ezekiel Choke",       description: "Sleeve choke from mount" },
          { id: "ch15", name: "Brabo Choke",         description: "Lapel-based choke" },
          { id: "ch16", name: "Von Flue Choke",      description: "Counter to guillotine" }
        ]
      },
      {
        id: "joint_locks", name: "Joint Locks", icon: "💪",
        techniques: [
          { id: "jl1",  name: "Armbar",              description: "Hyperextending the elbow" },
          { id: "jl2",  name: "Kimura",              description: "Figure-four shoulder lock" },
          { id: "jl3",  name: "Americana",           description: "Figure-four the other direction" },
          { id: "jl4",  name: "Omoplata",            description: "Shoulder lock with legs" },
          { id: "jl5",  name: "Wrist Lock",          description: "Applying pressure to the wrist" },
          { id: "jl6",  name: "Gogoplata",           description: "Shin across throat from guard" },
          { id: "jl7",  name: "Tarikoplata",         description: "Shoulder lock variation" },
          { id: "jl8",  name: "Baratoplata",         description: "Shoulder lock from bottom" },
          { id: "jl9",  name: "Monoplata",           description: "Single arm shoulder lock" },
          { id: "jl10", name: "Arm Crush",           description: "Crushing the arm with legs" }
        ]
      },
      {
        id: "leg_locks", name: "Leg Locks", icon: "🦵",
        techniques: [
          { id: "ll1",  name: "Straight Ankle Lock", description: "Basic ankle compression" },
          { id: "ll2",  name: "Heel Hook",           description: "Rotating the heel to attack knee" },
          { id: "ll3",  name: "Inside Heel Hook",    description: "Heel hook from inside position" },
          { id: "ll4",  name: "Outside Heel Hook",   description: "Heel hook from outside position" },
          { id: "ll5",  name: "Knee Bar",            description: "Hyperextending the knee" },
          { id: "ll6",  name: "Toe Hold",            description: "Figure-four on the foot" },
          { id: "ll7",  name: "Calf Slicer",         description: "Compression of the calf" },
          { id: "ll8",  name: "Banana Split",        description: "Splitting legs apart" },
          { id: "ll9",  name: "50/50 Heel Hook",     description: "Heel hook from 50/50 guard" },
          { id: "ll10", name: "Saddle / Honey Hole", description: "Inside heel hook entry position" },
          { id: "ll11", name: "Ashi Garami",         description: "Basic leg entanglement" }
        ]
      },
      {
        id: "escapes", name: "Escapes", icon: "🚪",
        techniques: [
          { id: "e1",  name: "Bridge and Roll",      description: "Escaping mount with bridge" },
          { id: "e2",  name: "Elbow-Knee Escape",    description: "Recovering guard from mount" },
          { id: "e3",  name: "Trap and Roll",        description: "Trapping arm and leg to escape" },
          { id: "e4",  name: "Guard Recovery",       description: "Re-establishing guard" },
          { id: "e5",  name: "Shrimp Escape",        description: "Hip escape to recover guard" },
          { id: "e6",  name: "Technical Stand-Up",   description: "Standing up safely from bottom" },
          { id: "e7",  name: "Turtle Escape",        description: "Escaping from turtle position" },
          { id: "e8",  name: "Back Escape",          description: "Escaping rear mount" },
          { id: "e9",  name: "Side Control Escape",  description: "Recovering from side control" },
          { id: "e10", name: "North-South Escape",   description: "Escaping north-south position" },
          { id: "e11", name: "Knee on Belly Escape", description: "Escaping knee on belly" },
          { id: "e12", name: "Leg Lock Escape",      description: "Defending and escaping leg locks" }
        ]
      },
      {
        id: "positions", name: "Positional Control", icon: "📍",
        techniques: [
          { id: "pos1",  name: "Mount",              description: "Sitting on opponent's torso" },
          { id: "pos2",  name: "High Mount",         description: "Mount high on chest/armpits" },
          { id: "pos3",  name: "Side Control",       description: "Chest to chest beside opponent" },
          { id: "pos4",  name: "Knee on Belly",      description: "Knee pressing on opponent's stomach" },
          { id: "pos5",  name: "Back Control",       description: "Behind opponent with hooks in" },
          { id: "pos6",  name: "Rear Mount",         description: "Back control with hooks" },
          { id: "pos7",  name: "North-South",        description: "Head to feet chest pressure" },
          { id: "pos8",  name: "Turtle Control",     description: "Controlling opponent in turtle" },
          { id: "pos9",  name: "Body Lock",          description: "Arms around opponent's waist" },
          { id: "pos10", name: "Crucifix",           description: "Both arms controlled from back" },
          { id: "pos11", name: "50/50 Guard",        description: "Mutual leg entanglement" }
        ]
      },
      {
        id: "transitions", name: "Transitions", icon: "🔀",
        techniques: [
          { id: "tr1",  name: "Back Take from Turtle",   description: "Taking back from turtle position" },
          { id: "tr2",  name: "Back Take from Guard",    description: "Taking back via omoplata or sweep" },
          { id: "tr3",  name: "Mount to Back Take",      description: "Transitioning to back control" },
          { id: "tr4",  name: "Guard to Mount",          description: "Sweeping to mount position" },
          { id: "tr5",  name: "Side Control to Mount",   description: "Advancing to mount" },
          { id: "tr6",  name: "Triangle to Armbar",      description: "Switching between submissions" },
          { id: "tr7",  name: "Kimura to Back Take",     description: "Using kimura to take back" },
          { id: "tr8",  name: "Omoplata to Sweep",       description: "Finishing or sweeping from omoplata" },
          { id: "tr9",  name: "Single Leg to Double",    description: "Changing leg attack" },
          { id: "tr10", name: "Leg Lock to Back Take",   description: "Transitioning from leg entanglement" },
          { id: "tr11", name: "DLR to Back Take",        description: "Back take from De La Riva" },
          { id: "tr12", name: "Berimbolo",               description: "Inverted back take sequence" }
        ]
      },
      {
        id: "drilling", name: "Drilling & Fundamentals", icon: "🔁",
        techniques: [
          { id: "dr1",  name: "Shrimping",           description: "Hip escape movement drill" },
          { id: "dr2",  name: "Bridging",            description: "Hip bridge movement drill" },
          { id: "dr3",  name: "Forward Roll",        description: "Basic forward rolling" },
          { id: "dr4",  name: "Backward Roll",       description: "Basic backward rolling" },
          { id: "dr5",  name: "Hip Switch",          description: "Switching hips drill" },
          { id: "dr6",  name: "Technical Stand-Up Drill", description: "Repeating the stand-up movement" },
          { id: "dr7",  name: "Pummelling",          description: "Underhook fighting drill" },
          { id: "dr8",  name: "Grip Fighting",       description: "Controlling and breaking grips" },
          { id: "dr9",  name: "Flow Rolling",        description: "Light technical sparring" },
          { id: "dr10", name: "Positional Sparring", description: "Sparring from specific positions" }
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

    // Drag to dismiss
    const handleArea = document.getElementById('tech-picker-panel');
    if (handleArea) {
      let startY = 0;
      let startTime = 0;

      handleArea.addEventListener('touchstart', e => {
        if (e.target.closest('.tech-picker-list')) return; // don't interfere with list scroll
        startY    = e.touches[0].clientY;
        startTime = Date.now();
      }, { passive: true });

      handleArea.addEventListener('touchmove', e => {
        if (e.target.closest('.tech-picker-list')) return;
        const delta = e.touches[0].clientY - startY;
        if (delta > 0) {
          handleArea.style.transition = 'none';
          handleArea.style.transform  = `translateY(${delta}px)`;
        }
      }, { passive: true });

      handleArea.addEventListener('touchend', e => {
        const delta    = e.changedTouches[0].clientY - startY;
        const velocity = delta / (Date.now() - startTime);
        handleArea.style.transition = '';
        handleArea.style.transform  = '';
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