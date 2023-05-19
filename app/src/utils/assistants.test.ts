import { sortAssistants } from './assistants';

describe('sortAssistants', () => {
  const assistant1 = {
    id: '1',
    prompt: 'bla',
    name: 'John',
  };
  const assistant2 = {
    id: '2',
    prompt: 'bla',
    name: 'Alice',
    lastMessageDate: new Date(),
  };
  const assistant3 = {
    id: '3',
    prompt: 'bla',
    name: 'Bob',
    lastMessageDate: new Date('2021-01-01'),
  };
  const assistant4 = {
    id: '4',
    prompt: 'bla',
    name: 'Jane',
  };

  it('should sort by name if both assistants have no last message date', () => {
    const sorted = sortAssistants([assistant1, assistant4]);
    expect(sorted).toEqual([assistant4, assistant1]);
  });

  it('should sort by last message date if both assistants have a last message date', () => {
    const sorted = sortAssistants([assistant3, assistant2]);
    expect(sorted).toEqual([assistant2, assistant3]);
  });

  it('if one assistant has no last message date - prefer the other one', () => {
    const sorted = sortAssistants([assistant1, assistant3]);
    expect(sorted).toEqual([assistant3, assistant1]);
  });
});
