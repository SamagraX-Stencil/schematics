import { Test, TestingModule } from '@nestjs/testing';
import { <%= classify(className) %>Provider } from './<%= name %>';

describe('<%= classify(className) %>Provider', () => {
  let provider: <%= classify(className) %>Provider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [<%= classify(className) %>Provider],
    }).compile();

    provider = module.get<<%= classify(className) %>Provider>(<%= classify(className) %>Provider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
