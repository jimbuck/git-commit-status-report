import { GitStatusService } from './git-status-service'
import { EOL } from 'os'

const EMPTY_STRING = '';

(async () => {
	const git = new GitStatusService('./');

	const commits = await git.commits({ since: '3 weeks ago', author: 'Jim' });

	const commitsGroupedByAuthor = groupBy(commits, c => c.author);

	commitsGroupedByAuthor.forEach(userCommits => {
		console.log(`# ${userCommits[0].author}:`);
		const commitsGroupedByDate = groupBy(userCommits, c => c.workDate);
		commitsGroupedByDate.forEach(commit => {
			console.log(`## ${commit[0].workDate}:
${commit.map(c => `- ${c.status} ${c.branch === 'dev' ? EMPTY_STRING : '(' + c.branch + ')'}`).join(EOL)}
`);
		})
		console.log(``);
	})

	//console.log(commits.map(c => `${c.hash.slice(0, 7)} [${c.commitDate.toISOString().slice(0, 10)}] ${c.author} (${c.branch}) ${c.subject}`).join(EOL));
})().catch(err => {
	console.error(err);
});

function groupBy<T>(list: T[], prop: (item: T) => string): T[][] {
	return list.reduce((groups, item) => {
		const groupKey = prop(item);

		const group = groups.find(g => g.some(x => prop(x) === groupKey));
		if (group) {
			group.push(item);
		} else {
			groups.push([item]);
		}

		return groups;
	}, [] as T[][]);
}