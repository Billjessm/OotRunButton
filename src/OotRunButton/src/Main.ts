import { EventsClient, EventHandler } from 'modloader64_api/EventHandler';
import { IModLoaderAPI, IPlugin } from 'modloader64_api/IModLoaderAPI';
import { InjectCore } from 'modloader64_api/CoreInjection';
import * as API from 'modloader64_api/OOT/OOTAPI';

const enum btnMask {
  C_RIGHT = 0x0001,
  C_LEFT = 0x0002,
  C_DOWN = 0x0004,
  C_UP = 0x0008,
  R = 0x0010,
  L = 0x0020,
  D_UP = 0x0800,
  START = 0x1000,
  Z = 0x2000,
  B = 0x4000,
  A = 0x8000,
}

export class OotRunButton implements IPlugin {
  ModLoader = {} as IModLoaderAPI;
  name = 'OotRunButton';

  @InjectCore() core!: API.IOOTCore;

  private gc: number = 0x00;
  private btnRun: btnMask = btnMask.L;

  constructor() { }

  preinit(): void { }

  init(): void { }

  postinit(): void {
    this.gc = global.ModLoader['global_context_pointer'];
  }

  onTick(): void {
    // Read 'Button' Code
    let curBtn = this.ModLoader.emulator.rdramReadPtr16(this.gc, 0x14);

    // Determine if holding start (to set custom run button)
    if ((curBtn & btnMask.START) !== 0) {

      // New button equals A
      if ((curBtn & btnMask.A) !== 0) {
        this.btnRun = btnMask.A;
        return;
      }
      
      // New button equals B
      if ((curBtn & btnMask.B) !== 0) {
        this.btnRun = btnMask.B;
        return;
      }
      
      // New button equals Z
      if ((curBtn & btnMask.Z) !== 0) {
        this.btnRun = btnMask.Z;
        return;
      }
      
      // New button equals L
      if ((curBtn & btnMask.L) !== 0) {
        this.btnRun = btnMask.L;
        return;
      }
      
      // New button equals R
      if ((curBtn & btnMask.R) !== 0) {
        this.btnRun = btnMask.R;
        return;
      }
      
      // New button equals D-Up
      if ((curBtn & btnMask.D_UP) !== 0) {
        this.btnRun = btnMask.D_UP;
        return;
      }
      
      // New button equals C-Up
      if ((curBtn & btnMask.C_UP) !== 0) {
        this.btnRun = btnMask.C_UP;
        return;
      }
      
      // New button equals C-Down
      if ((curBtn & btnMask.C_DOWN) !== 0) {
        this.btnRun = btnMask.C_DOWN;
        return;
      }
      
      // New button equals C-Left
      if ((curBtn & btnMask.C_LEFT) !== 0) {
        this.btnRun = btnMask.C_LEFT;
        return;
      }
      
      // New button equals C-Right
      if ((curBtn & btnMask.C_RIGHT) !== 0) {
        this.btnRun = btnMask.C_RIGHT;
        return;
      }
    }

    // Make sure we are in a valid state to run
    let state = this.core.link.state;
    if (!(
      state === API.LinkState.STANDING ||
      state === API.LinkState.SWIMMING ||
      state === API.LinkState.JUMPING ||
      state === API.LinkState.HOLDING_ACTOR
    )) return;

    // Escape if not holding run button
    if ((curBtn & this.btnRun) === 0) return;

    // Add half speed quarter gravity extra to normal speed
    let vx = this.core.link.rdramReadF32(0x5c) / 2;
    let vy = this.core.link.rdramReadF32(0x60) / 4;
    let vz = this.core.link.rdramReadF32(0x64) / 2;
    let px = this.core.link.rdramReadF32(0x24);
    let py = this.core.link.rdramReadF32(0x28);
    let pz = this.core.link.rdramReadF32(0x2c);
    this.core.link.rdramWriteF32(0x24, vx + px);
    this.core.link.rdramWriteF32(0x28, vy + py);
    this.core.link.rdramWriteF32(0x2c, vz + pz);
  }

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onClient_InjectFinished(evt: any) { }
}
