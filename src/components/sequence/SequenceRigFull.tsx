import { SequenceRig } from './SequenceRig';
import { C01_Dispersion } from './chambers/C01_Dispersion';
import { C02_FailClosed } from './chambers/C02_FailClosed';
import { C03_GovernedFactory } from './chambers/C03_GovernedFactory';
import { C04_TruthReturned } from './chambers/C04_TruthReturned';
import { C05_Category } from './chambers/C05_Category';

export function SequenceRigFull() {
  return (
    <SequenceRig>
      <C01_Dispersion />
      <C02_FailClosed />
      <C03_GovernedFactory />
      <C04_TruthReturned />
      <C05_Category />
    </SequenceRig>
  );
}
