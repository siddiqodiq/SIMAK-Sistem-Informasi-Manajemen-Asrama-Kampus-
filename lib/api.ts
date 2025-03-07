type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: object
  headers?: Record<string, string>
}

export async function fetchApi(url: string, options: FetchOptions = {}) {
  const { method = "GET", body, headers = {} } = options

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  }
}

