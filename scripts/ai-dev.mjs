import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';


// ============================================================
// ADS INTELLIGENCE — AI DEVELOPMENT CLI
//
// Supported usage:
//
// Short inline task:
// npm run ai:dev -- "Update README..."
//
// Large task from file:
// npm run ai:dev -- --file tasks/sprint-04.md
//
// Task using a specific base branch:
// npm run ai:dev -- --base ai/task-dev-192 "Fix typecheck..."
//
// File task using a specific base branch:
// npm run ai:dev -- --base ai/task-dev-192 --file tasks/correction.md
//
// Environment variables:
//
// N8N_ADS_DEV_WEBHOOK
// N8N_ADS_DEV_KEY
// ============================================================


// ============================================================
// Helpers
// ============================================================

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}


function getRequiredEnv(name) {
  const value = process.env[name];

  if (
    typeof value !== 'string' ||
    !value.trim()
  ) {
    fail(
      `Variável de ambiente obrigatória não configurada: ${name}`
    );
  }

  return value.trim();
}


function readTaskFromFile(fileArgument) {
  if (
    typeof fileArgument !== 'string' ||
    !fileArgument.trim()
  ) {
    fail(
      'Informe o caminho do ficheiro após --file.'
    );
  }

  const resolvedPath = path.resolve(
    process.cwd(),
    fileArgument.trim()
  );

  if (!fs.existsSync(resolvedPath)) {
    fail(
      `Ficheiro de tarefa não encontrado: ${resolvedPath}`
    );
  }

  const stat = fs.statSync(resolvedPath);

  if (!stat.isFile()) {
    fail(
      `O caminho informado não é um ficheiro: ${resolvedPath}`
    );
  }

  const content = fs.readFileSync(
    resolvedPath,
    'utf8'
  );

  if (!content.trim()) {
    fail(
      `O ficheiro de tarefa está vazio: ${resolvedPath}`
    );
  }

  return {
    task: content.trim(),
    source: 'file',
    sourcePath: resolvedPath
  };
}


function readInlineTask(args) {
  const task = args.join(' ').trim();

  if (!task) {
    fail(
      [
        'Nenhuma tarefa foi informada.',
        '',
        'Uso:',
        'npm run ai:dev -- "Descrição da tarefa"',
        '',
        'ou:',
        'npm run ai:dev -- --file tasks/sprint-04.md',
        '',
        'ou com branch base específica:',
        'npm run ai:dev -- --base ai/task-dev-192 "Descrição da tarefa"',
        '',
        'ou:',
        'npm run ai:dev -- --base ai/task-dev-192 --file tasks/correction.md'
      ].join('\n')
    );
  }

  return {
    task,
    source: 'inline',
    sourcePath: null
  };
}


function validateBaseBranch(value) {
  if (
    typeof value !== 'string' ||
    !value.trim()
  ) {
    fail(
      'Informe a branch após --base.'
    );
  }

  const branch = value.trim();

  if (branch.length > 255) {
    fail(
      'A branch informada excede o limite de 255 caracteres.'
    );
  }

  if (
    branch === '.' ||
    branch === '..' ||
    branch.startsWith('/') ||
    branch.endsWith('/') ||
    branch.startsWith('.') ||
    branch.endsWith('.') ||
    branch.includes('..') ||
    branch.includes('//') ||
    branch.includes('@{') ||
    branch.endsWith('.lock') ||
    /[\s~^:?*[\]\\]/.test(branch)
  ) {
    fail(
      `Branch base inválida: ${branch}`
    );
  }

  return branch;
}


// ============================================================
// Parse CLI arguments
// ============================================================

const args = process.argv.slice(2);

let baseBranch = 'main';
let fileArgument = null;
const taskArguments = [];

let baseSeen = false;
let fileSeen = false;

for (
  let index = 0;
  index < args.length;
  index += 1
) {
  const argument = args[index];

  if (argument === '--base') {
    if (baseSeen) {
      fail(
        'A opção --base foi informada mais de uma vez.'
      );
    }

    const value = args[index + 1];

    if (
      typeof value !== 'string' ||
      !value.trim() ||
      value.startsWith('--')
    ) {
      fail(
        'Informe a branch após --base.'
      );
    }

    baseBranch = validateBaseBranch(value);
    baseSeen = true;
    index += 1;
    continue;
  }

  if (argument === '--file') {
    if (fileSeen) {
      fail(
        'A opção --file foi informada mais de uma vez.'
      );
    }

    const value = args[index + 1];

    if (
      typeof value !== 'string' ||
      !value.trim() ||
      value.startsWith('--')
    ) {
      fail(
        'Informe o caminho do ficheiro após --file.'
      );
    }

    fileArgument = value;
    fileSeen = true;
    index += 1;
    continue;
  }

  if (argument.startsWith('--')) {
    fail(
      `Opção desconhecida: ${argument}`
    );
  }

  taskArguments.push(argument);
}


if (
  fileSeen &&
  taskArguments.length > 0
) {
  fail(
    'Ao utilizar --file, não informe também uma tarefa inline.'
  );
}


let taskInput;

if (fileSeen) {
  taskInput = readTaskFromFile(
    fileArgument
  );
} else {
  taskInput = readInlineTask(
    taskArguments
  );
}


// ============================================================
// Validate task
// ============================================================

const task = taskInput.task;

if (task.length < 3) {
  fail(
    'A tarefa informada é demasiado curta.'
  );
}


// Safety limit against accidental huge uploads.
// This is intentionally much larger than normal sprint prompts.

const MAX_TASK_LENGTH = 250_000;

if (task.length > MAX_TASK_LENGTH) {
  fail(
    `A tarefa excede o limite de ${MAX_TASK_LENGTH} caracteres.`
  );
}


// ============================================================
// Configuration
// ============================================================

const webhook = getRequiredEnv(
  'N8N_ADS_DEV_WEBHOOK'
);

const apiKey = getRequiredEnv(
  'N8N_ADS_DEV_KEY'
);


// ============================================================
// Validate webhook
// ============================================================

let webhookUrl;

try {
  webhookUrl = new URL(webhook);
} catch {
  fail(
    'N8N_ADS_DEV_WEBHOOK não contém uma URL válida.'
  );
}


if (
  webhookUrl.protocol !== 'https:' &&
  webhookUrl.protocol !== 'http:'
) {
  fail(
    'N8N_ADS_DEV_WEBHOOK deve utilizar HTTP ou HTTPS.'
  );
}


// ============================================================
// Request
// ============================================================

console.log('');
console.log(
  'ADS INTELLIGENCE — AI Development Orchestrator'
);

console.log(
  `Task source: ${taskInput.source}`
);

if (taskInput.sourcePath) {
  console.log(
    `Task file: ${taskInput.sourcePath}`
  );
}

console.log(
  `Base branch: ${baseBranch}`
);

console.log(
  `Task size: ${task.length} characters`
);

console.log('');
console.log(
  'Enviando pedido ao orquestrador...'
);


// ============================================================
// Call n8n
// ============================================================

let response;

try {
  response = await fetch(
    webhookUrl,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json; charset=utf-8',

        'X-ADS-DEV-KEY':
          apiKey
      },

      body: JSON.stringify({
        task,
        base_branch: baseBranch
      })
    }
  );
} catch (error) {
  fail(
    `Não foi possível contactar o orquestrador: ${
      error?.message || String(error)
    }`
  );
}


// ============================================================
// Read response
// ============================================================

const responseText =
  await response.text();


if (!response.ok) {
  fail(
    [
      `O orquestrador respondeu HTTP ${response.status}.`,
      responseText || '(sem corpo de resposta)'
    ].join('\n')
  );
}


// ============================================================
// Success
// ============================================================

console.log('');
console.log(
  '✓ Pedido recebido pelo orquestrador.'
);

console.log(
  `Base branch enviada: ${baseBranch}`
);

if (responseText) {
  console.log('');
  console.log(
    'Resposta:'
  );

  console.log(
    responseText
  );
}

console.log('');