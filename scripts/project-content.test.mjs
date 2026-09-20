import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { polishProject } from '../src/utils/projectContent.js';

test('updates legacy copy without mutating the source record', () => {
    const original = { description: 'Developed genre-specific book recommendation system using Amazon book reviews.', demo: 'https://www.example.com' };
    const result = polishProject(original);
    assert.match(result.description, /Apache Spark/);
    assert.equal(result.demo, undefined);
    assert.equal(original.demo, 'https://www.example.com');
});

test('preserves newer admin copy and real demo links', () => {
    const original = { description: 'New description from the admin.', demo: 'https://youtu.be/demo', source: 'https://github.com/johnchoi44/GROOP' };
    assert.deepEqual(polishProject(original), original);
});

test('removes reserved example domains and invalid links', () => {
    for (const demo of ['https://example.com', 'https://www.example.org/path', 'https://demo.example.net', 'not a url', 'javascript:alert(1)']) {
        assert.equal(polishProject({ demo }).demo, undefined);
    }
    assert.equal(polishProject({ demo: 'https://example.com.real-domain.com' }).demo, 'https://example.com.real-domain.com');
});

test('local project content is already polished and placeholder-free', () => {
    const projects = JSON.parse(readFileSync(new URL('../src/data/projects.json', import.meta.url)));
    for (const project of projects) assert.deepEqual(polishProject(project), project);
    assert.equal(projects[0].title, 'Resume Generator');
    for (const title of ['Book Recommendation System', 'Workplace Social Media Activity']) {
        assert.equal(projects.find(project => project.title === title).demo, undefined);
    }
});
