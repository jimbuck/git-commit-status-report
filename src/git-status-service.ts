import execa from 'execa';

const FIELD_SEP = ' ^&^ ';
const ROW_SEP = '&!&';
const MERGED_PR_REGEX = /^Merged PR \d+: /gi;

export class GitStatusService {

	constructor(private dir: string) { }

	public async commits({ since, author }: { since: string, author?: string|string[] }): Promise<Commit[]> {
		since ||= '2 weeks ago';
		const args = [
			'--date=iso-local',
			`--pretty=format:${['%H', '%ad', '%ar', '%an', '%ae', '%S', '%s', '%b'].join(FIELD_SEP) + ROW_SEP}`,
			`--since=${since}`,
			'--branches',
			'--no-merges'
		];


		if (author) {
			if (typeof author === 'string') author = [author];
			author.forEach(a => args.unshift(`--author=${a}`))
		}

		const result = await this.git('log', args);

		const parsedData = result.split(ROW_SEP).filter(r => !!r).map(row => row.split(FIELD_SEP).map(f => f.trim()));
		return parsedData.map(([hash, commitDateStr, commitDateRelative, author, email, branch, subject, body]: string[]) => {

			const commitDate = new Date(commitDateStr);

			const workDateDate = new Date(commitDateStr);
			workDateDate.setHours(commitDate.getHours() - 3);
			const workDate = workDateDate.toISOString().slice(0, 10);

			const status = subject.replace(MERGED_PR_REGEX, '')

			return {
				hash,
				commitDate: new Date(commitDate),
				commitDateRelative,
				workDate,
				author,
				email,
				branch,
				status,
				subject,
				body
			};
		});
	}

	private async git(command: string, args: string[]): Promise<string> {
		const result = await execa('git', [command, ...args], {
			cwd: this.dir
		});
		if (result.failed) {
			throw new Error(result.stderr);
		}

		return result.stdout;
	}
}

export interface Commit {
	hash: string;
	commitDate: Date;
	commitDateRelative: string;
	workDate: string;
	author: string;
	email: string;
	branch: string;
	status: string;
	subject: string;
	body: string;
}