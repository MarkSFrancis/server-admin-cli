import { Command, Option } from 'commander';
import { number, input } from '@inquirer/prompts';

export const tvEstimateEndDateCommand = new Command('end-date')
  .addOption(
    new Option(
      '-d, --date <string>',
      'the date of the most recent episode in the series'
    )
  )
  .addOption(
    new Option(
      '-t, --total-episodes <number>',
      'the total number of episodes in the series'
    )
  )
  .action(
    async (options: {
      date?: string;
      episodeNumber?: number;
      totalEpisodes?: number;
    }) => {
      const episodeNumber = options.episodeNumber ?? (await getEpisodeNumber());
      const date = new Date(options.date ?? (await getDate()));
      const totalEpisodes = options.totalEpisodes ?? (await getEpisodeCount());

      if (isNaN(date.getTime())) {
        console.error('Invalid date format. Please use YYYY-MM-DD.');
        process.exit(1);
      }

      const endDate = estimateEndDate({
        date,
        episodeNumber,
        totalEpisodes,
      });

      console.info(
        `Estimated end date for the series is: ${endDate.toISOString().split('T')[0]}`
      );
    }
  );

function getEpisodeNumber() {
  return number({
    message:
      'Enter the episode number of the most recent episode in the series',
    required: true,
    default: 1,
  });
}

function getEpisodeCount() {
  return number({
    message: 'Enter the total number of episodes in the series',
    required: true,
    default: 12,
  });
}

async function getDate() {
  function appendYearIfMissing(input: string) {
    if (/^\d{2}-\d{2}$/.test(input)) {
      input = `${new Date().toISOString().substring(0, 5)}${input}`;
    }

    return input;
  }

  const date = await input({
    message: 'Enter the date of the most recent episode in the series',
    required: true,
    validate: (input) => {
      input = appendYearIfMissing(input);

      const date = new Date(input);
      if (isNaN(date.getTime())) {
        return 'Please enter a valid date in the format [YYYY-]MM-DD';
      }

      return true;
    },
  });

  return appendYearIfMissing(date);
}

function estimateEndDate(options: {
  date: Date;
  episodeNumber: number;
  totalEpisodes: number;
}) {
  const endDate = new Date(options.date);
  endDate.setDate(
    endDate.getDate() + (options.totalEpisodes - options.episodeNumber) * 7
  );

  return endDate;
}
