package handlers

func hasPermission(permissions interface{}, permission string) bool {
	permList, ok := permissions.([]string)
	if !ok {
		return false
	}
	for _, perm := range permList {
		if perm == permission {
			return true
		}
	}
	return false
}
