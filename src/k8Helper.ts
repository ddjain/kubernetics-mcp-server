import * as k8s from '@kubernetes/client-node';

// Load kubeconfig and clients once
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);
const eventsV1Api = kc.makeApiClient(k8s.EventsV1Api);
const metricsApi = new k8s.Metrics(kc);



// Get all pods in all namespaces
export async function getAllPods(): Promise<string[]> {
  try {
    const res = await coreV1Api.listPodForAllNamespaces();
    // res is V1PodList, items is array of V1Pod
    return res.items.map(
      (pod: k8s.V1Pod) =>
        `Namespace: ${pod.metadata?.namespace}, Pod: ${pod.metadata?.name}, Status: ${pod.status?.phase}`
    );
  } catch (err) {
    console.error('Error fetching pods:', err);
    return ['Error fetching pods'];
  }
}

// Get all namespaces
export async function getAllNamespaces(): Promise<string[]> {
  try {
    const res = await coreV1Api.listNamespace();
    return res.items.map(
      (ns: k8s.V1Namespace) => `Namespace: ${ns.metadata?.name}`
    );
  } catch (err) {
    console.error('Error fetching namespaces:', err);
    return ['Error fetching namespaces'];
  }
}

// Get pods by namespace
export async function getPodsByNamespace(namespace: string): Promise<string[]> {
  try {
    const res = await coreV1Api.listNamespacedPod({namespace});
    return res.items.map(
      (pod: k8s.V1Pod) =>
        `Namespace: ${pod.metadata?.namespace}, Pod: ${pod.metadata?.name}, Status: ${pod.status?.phase}`
    );
  } catch (err) {
    console.error(`Error fetching pods for namespace ${namespace}:`, err);
    return [`Error fetching pods for namespace ${namespace}`];
  }
}

// Describe a specific pod
export async function describePod(name: string, namespace: string): Promise<string> {
  try {
    // readNamespacedPod expects positional args (name, namespace)
    const res = await coreV1Api.readNamespacedPod({name, namespace});
    // res is { body: V1Pod } in recent versions, else just V1Pod
    const pod = ('body' in res) ? res.body : res;
    return JSON.stringify(pod, null, 2);
  } catch (err) {
    console.error(`Error describing pod ${name} in ${namespace}:`, err);
    return `Error describing pod ${name}`;
  }
}

export async function getSortedEvents(namespace: string): Promise<string[]> {
  try {
    const res = await eventsV1Api.listNamespacedEvent({namespace});
    return [JSON.stringify(res)];
    // res is V1EventList, with items array
    // const events = ('body' in res) ? res.body.items : res.items;
    // const sorted = events.sort((a: k8s.V1Event, b: k8s.V1Event) => {
    //   const timeA = new Date(a.eventTime ?? a.lastTimestamp ?? '').getTime() || 0;
    //   const timeB = new Date(b.eventTime ?? b.lastTimestamp ?? '').getTime() || 0;
    //   return timeA - timeB;
    // });
    // return sorted.map((event: k8s.V1Event) =>
    //   `[${event.eventTime ?? event.lastTimestamp ?? 'unknown time'}] ${event.reason}: ${
    //     event.note ?? event.message ?? ''
    //   }`
    // );
  } catch (err) {
    console.error(`Error fetching events for namespace ${namespace}:`, err);
    return [`Error fetching events for namespace ${namespace}`];
  }
}

// Get node resource usage (CPU/Memory)
export async function topNodes(): Promise<string[]> {
  try {
    const res = await metricsApi.getNodeMetrics();
    // metricsApi returns metrics with items array
    return res.items.map(
      (node: any) =>
        `Node: ${node.metadata?.name}, CPU: ${node.usage?.cpu}, Memory: ${node.usage?.memory}`
    );
  } catch (err) {
    console.error('Error fetching node metrics:', err);
    return ['Error fetching node metrics'];
  }
}

// Get node taints and labels
export async function getNodeDetails(): Promise<string[]> {
  try {
    const res = await coreV1Api.listNode();
    console.log('Node details response:', res);
    return [JSON.stringify(res)];

    // const nodes = ('body' in res) ? res.body.items : res.items;
    // return nodes.map((node: k8s.V1Node) => {
    //   const taints = JSON.stringify(node.spec?.taints ?? []);
    //   const labels = JSON.stringify(node.metadata?.labels ?? {});
    //   return `Node: ${node.metadata?.name}\n  Taints: ${taints}\n  Labels: ${labels}`;
    // });
  } catch (err) {
    console.error('Error fetching node details:', err);
    return ['Error fetching node details'];
  }
}
